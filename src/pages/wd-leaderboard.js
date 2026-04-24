import { LitElement, html, css } from 'lit';
import '../components/wd-header.js';
import '../components/wd-footer.js';
import '../components/wd-drafter-card.js';
import '../components/wd-team-card.js';
import '../components/wd-loading.js';
import { loadSavedTheme } from '../themes.js';
import {
  fetchDrafts,
  fetchTeams,
  fetchSchedule,
  loadAllStats,
  findHeadToHeadMatchups,
  getLatestYear,
  isOffseason,
  getGameStatus,
  formatGameScore,
  formatGameInfo,
  isByeWeek,
} from '../api.js';

export class WdLeaderboard extends LitElement {
  static properties = {
    _loading: { state: true },
    _stats: { state: true },
    _selectedYear: { state: true },
    _availableYears: { state: true },
    _week: { state: true },
    _isOffseason: { state: true },
    _matchups: { state: true },
    _schedule: { state: true },
  };

  constructor() {
    super();
    this._loading = true;
    this._stats = [];
    this._selectedYear = null;
    this._availableYears = [];
    this._week = null;
    this._isOffseason = false;
    this._matchups = new Map();
    this._schedule = null;
  }

  async connectedCallback() {
    super.connectedCallback();
    loadSavedTheme();
    const drafts = await fetchDrafts();
    this._availableYears = Object.keys(drafts).map(Number).sort((a, b) => b - a);
    const latest = getLatestYear(drafts);
    this._selectedYear = latest;
    await this._loadYear(latest, drafts);
  }

  async _loadYear(year, drafts) {
    this._loading = true;

    if (!drafts) drafts = await fetchDrafts();
    const allTeams = await fetchTeams();

    const isLatest = year === getLatestYear(drafts);
    let schedule = null;
    let week = null;

    if (isLatest) {
      const result = await fetchSchedule();
      schedule = result.schedule;
      week = result.week;
    }

    this._schedule = schedule;
    this._week = week;
    this._isOffseason = isLatest ? isOffseason(schedule) : true;

    const stats = await loadAllStats(drafts, year, allTeams, schedule);

    for (const drafter of stats) {
      drafter.totalWins = drafter.teams.reduce((sum, t) => sum + t.wins, 0);
    }

    const leftovers = stats.filter(d => d.name === 'LEFTOVERS');
    const players = stats
      .filter(d => d.name !== 'LEFTOVERS')
      .sort((a, b) => b.totalWins - a.totalWins);

    this._stats = [...players, ...leftovers];

    if (!this._isOffseason && schedule) {
      this._matchups = findHeadToHeadMatchups(this._stats);
    } else {
      this._matchups = new Map();
    }

    this._loading = false;
  }

  _onYearChange(e) {
    const year = Number(e.detail.value);
    this._selectedYear = year;
    this._loadYear(year);
  }

  _getH2hOpponent(teamAbbr, drafterName) {
    for (const [, matchup] of this._matchups) {
      if (matchup.team1 === teamAbbr && matchup.player1 === drafterName) return matchup.player2;
      if (matchup.team2 === teamAbbr && matchup.player2 === drafterName) return matchup.player1;
    }
    return '';
  }

  _getTeamLink(team) {
    if (team.links && team.links.length > 3) return team.links[3].href;
    if (team.links && team.links.length > 0) return team.links[0].href;
    return '#';
  }

  static styles = css`
    :host { display: block; min-height: 100vh; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 2px;
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--space-4);
    }

    @media (max-width: 440px) {
      .grid { grid-template-columns: 1fr; padding: var(--space-2); }
    }
  `;

  render() {
    if (this._loading) {
      return html`<wd-loading></wd-loading>`;
    }

    const maxWins = Math.max(...this._stats.filter(d => d.name !== 'LEFTOVERS').map(d => d.totalWins), 1);

    return html`
      <wd-header
        .year=${this._selectedYear}
        .week=${this._week}
        ?show-week=${!this._isOffseason && this._week}
      ></wd-header>

      <div class="grid">
        ${this._stats.map((drafter, i) => {
          const isLeftovers = drafter.name === 'LEFTOVERS';
          const rank = isLeftovers ? 0 : i + 1;
          const sortedTeams = [...drafter.teams].sort((a, b) => b.wins - a.wins);

          return html`
            <wd-drafter-card
              .name=${drafter.name}
              .rank=${rank}
              .totalWins=${drafter.totalWins}
              .maxWins=${maxWins}
              ?is-leftovers=${isLeftovers}
              style="animation-delay: ${i * 60}ms"
            >
              ${sortedTeams.map(team => {
                const status = this._isOffseason ? 'offseason'
                  : isByeWeek(this._schedule, team.abbreviation) ? 'bye'
                  : getGameStatus(team.nextGame);

                return html`
                  <wd-team-card
                    .name=${team.shortDisplayName || team.displayName || team.name}
                    .abbreviation=${team.abbreviation}
                    .logo=${team.logos?.[0]?.href || ''}
                    .wins=${team.wins}
                    .record=${team.record}
                    .color=${team.color || '333333'}
                    .alternateColor=${team.alternateColor || team.color || '555555'}
                    .link=${this._getTeamLink(team)}
                    .gameStatus=${status}
                    .gameInfo=${status === 'scheduled' ? formatGameInfo(team.nextGame, team.abbreviation) : ''}
                    .gameScore=${status === 'live' || status === 'final' ? formatGameScore(team.nextGame, team.abbreviation) : ''}
                    .h2hOpponent=${this._getH2hOpponent(team.abbreviation, drafter.name)}
                    ?compact=${isLeftovers}
                  ></wd-team-card>
                `;
              })}
            </wd-drafter-card>
          `;
        })}
      </div>

      <wd-footer
        .years=${this._availableYears}
        .selectedYear=${String(this._selectedYear)}
        @wd-change=${this._onYearChange}
      ></wd-footer>
    `;
  }
}

customElements.define('wd-leaderboard', WdLeaderboard);
