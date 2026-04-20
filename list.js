import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {api, loadAllStats, changeYear, getAvailableYears, findHeadToHeadMatchups} from './controller.js';

class MyList extends LitElement {
  static get properties() {
    return {
      totalWins: {type: Number},
      loading: {type: Boolean},
      selectedYear: {type: Number},
      availableYears: {type: Array}
    };
  }
  constructor() {
    super();
    this.loading = true
    this.selectedYear = api.currentYear
    this.availableYears = getAvailableYears()
    this.loadStats()
  }

  async loadStats() {
    const stats = await loadAllStats()

    this.stats = stats
    this.headToHeadMatchups = findHeadToHeadMatchups(stats)
    this.loading = false
    this.selectedYear = api.currentYear
  }

  async handleYearChange(e) {
    const newYear = parseInt(e.target.value)

    if (newYear !== this.selectedYear) {
      this.loading = true
      try {
        const success = await changeYear(newYear)
        if (success) {
          this.selectedYear = newYear
          await this.loadStats()
        } else {
          this.loading = false
          alert(`Failed to load data for year ${newYear}`)
        }
      } catch (error) {
        console.error('Error changing year:', error)
        this.loading = false
        alert(`Error loading data for year ${newYear}`)
      }
    }
  }

  getTotalWins(draft) {
    return draft.teams.reduce((acc, team) => {
      return acc + team.wins
    }, 0)
  }

  getStatus(game, shortName) {
    const status = game.status.type.name
    const date = new Date(game.date)

    if (status === 'STATUS_FINAL') {
      const score1 = html`<span ?winner=${game.competitors[0].winner}>${game.competitors[0].team.abbreviation} ${game.competitors[0].score}</span>`
      const score2 = html`<span ?winner=${game.competitors[1].winner}>${game.competitors[1].team.abbreviation} ${game.competitors[1].score}</span>`
      return html`Final: ${score1} - ${score2}`
    }

    if (status === 'STATUS_IN_PROGRESS') {
      const score1 = html`<span>${game.competitors[0].team.abbreviation} ${game.competitors[0].score}</span>`
      const score2 = html`<span>${game.competitors[1].team.abbreviation} ${game.competitors[1].score}</span>`
      return html`<span class="live-badge">LIVE</span> ${score1} - ${score2}`
    }

    return `${shortName} - ` + date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  }

  static get styles() {
    return css`
      :host {
        font-family: 'Saira Condensed', sans-serif;
        display: block;
        background: #0f1117;
        min-height: 100vh;
        color: #e2e8f0;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }

      @keyframes slideUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes loadBounce {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.4); opacity: 1; }
      }

      @keyframes barGrow {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }

      /* ── Loading ── */

      .loading-screen {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 80vh;
        gap: 24px;
      }

      .loading-screen h1 {
        font-family: 'Bungee', cursive;
        font-size: 24px;
        color: #ff3c50;
        text-transform: uppercase;
        letter-spacing: 4px;
        animation: pulse 1.5s ease-in-out infinite;
        margin: 0;
      }

      .loading-dots {
        display: flex;
        gap: 10px;
      }

      .loading-dots span {
        width: 14px;
        height: 14px;
        background: #ff3c50;
        border-radius: 50%;
        animation: loadBounce 1.4s ease-in-out infinite;
      }

      .loading-dots span:nth-child(2) { animation-delay: 0.15s; }
      .loading-dots span:nth-child(3) { animation-delay: 0.3s; }

      /* ── Header ── */

      header {
        background:
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 14px,
            rgba(255,255,255,0.04) 14px,
            rgba(255,255,255,0.04) 28px
          ),
          linear-gradient(135deg, #dc2626 0%, #f97316 100%);
        padding: 20px 20px 16px;
        position: sticky;
        top: 0;
        z-index: 10;
        box-shadow: 0 4px 30px rgba(220, 38, 38, 0.3);
      }

      .header-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      h1 {
        font-family: 'Bungee', cursive;
        color: white;
        font-size: 36px;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 3px 0 rgba(0,0,0,0.2);
        line-height: 1.1;
      }

      .week-badge {
        font-family: 'Bungee', cursive;
        font-size: 16px;
        background: rgba(0,0,0,0.25);
        padding: 6px 14px;
        border-radius: 100px;
        color: white;
        white-space: nowrap;
        letter-spacing: 1px;
        backdrop-filter: blur(4px);
        border: 2px solid rgba(255,255,255,0.2);
      }

      /* ── Grid ── */

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: 2px;
        max-width: 1400px;
        margin: 0 auto;
        background: #0f1117;
      }

      /* ── Player Card ── */

      .item {
        background: #161922;
        padding-bottom: 16px;
        animation: slideUp 0.5s ease-out both;
      }

      .item:nth-child(2) { animation-delay: 0.08s; }
      .item:nth-child(3) { animation-delay: 0.12s; }
      .item:nth-child(4) { animation-delay: 0.18s; }
      .item:nth-child(5) { animation-delay: 0.24s; }

      .player-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 14px 0;
      }

      .rank {
        font-family: 'Bungee', cursive;
        font-size: 32px;
        color: #475569;
        min-width: 36px;
        text-align: center;
        line-height: 1;
        text-shadow: 0 2px 0 rgba(0,0,0,0.3);
      }

      .rank.rank-1 { color: #fbbf24; }
      .rank.rank-2 { color: #94a3b8; }
      .rank.rank-3 { color: #d97706; }

      .player-name {
        font-family: 'Bungee', cursive;
        font-size: 28px;
        color: white;
        text-transform: uppercase;
        letter-spacing: 2px;
        line-height: 1;
      }

      .win-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: auto;
        padding-right: 8px;
      }

      .win-count {
        font-family: 'Bungee', cursive;
        font-size: 36px;
        color: #ff3c50;
        line-height: 1;
      }

      .win-label {
        font-size: 11px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      /* ── Win Bar ── */

      .win-bar {
        height: 4px;
        background: rgba(255, 255, 255, 0.06);
        margin: 12px 14px 0;
        border-radius: 100px;
        overflow: hidden;
      }

      .win-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff3c50, #f97316);
        border-radius: 100px;
        transform-origin: left;
        animation: barGrow 0.8s ease-out 0.3s both;
      }

      .separator {
        height: 1px;
        background: rgba(255, 255, 255, 0.06);
        margin: 12px 14px 0;
      }

      /* ── Team Cards ── */

      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }

      .team-link {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 14px;
        background: linear-gradient(155deg, var(--team-color) 55%, var(--alternate-color) 50%);
        padding: 12px 16px 12px 8px;
        border-left: 5px solid var(--alternate-color);
        font-size: 20px;
        font-weight: 700;
        color: white;
        margin: 6px 10px;
        border-radius: 12px;
        text-shadow: 0 1px 3px rgba(0,0,0,0.5), 0 0 8px rgba(0,0,0,0.2);
        transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
        overflow: hidden;
      }

      .team-link::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 100%);
        pointer-events: none;
        z-index: 1;
      }

      .team-link:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      }

      .team-link:active {
        transform: scale(0.98);
        transition-duration: 0.1s;
      }

      .team-link.h2h {
        box-shadow: 0 0 0 2px #fbbf24, 0 4px 16px rgba(251,191,36,0.25);
      }

      .team-link.h2h:hover {
        box-shadow: 0 0 0 2px #fbbf24, 0 8px 24px rgba(251,191,36,0.4);
      }

      /* ── Logo ── */

      .logo {
        background: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 60px;
        position: relative;
        z-index: 2;
      }

      .logo img {
        filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
      }

      .record {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        background: rgba(0,0,0,0.55);
        padding: 2px 8px;
        border-radius: 100px;
        margin-top: 4px;
        backdrop-filter: blur(4px);
      }

      /* ── Team Info ── */

      .team-info {
        flex: 1;
        min-width: 0;
        position: relative;
        z-index: 2;
      }

      .team-name-wins {
        display: flex;
        align-items: baseline;
        gap: 6px;
        flex-wrap: wrap;
      }

      .team-wins-num {
        font-family: 'Bungee', cursive;
        font-size: 26px;
        line-height: 1;
      }

      .team-wins-label {
        font-size: 13px;
        font-weight: 400;
        opacity: 0.75;
        text-shadow: none;
      }

      .game-info {
        font-size: 12px;
        font-weight: 600;
        margin-top: 6px;
        color: #1a1a2e;
        background: rgba(255,255,255,0.92);
        padding: 4px 10px;
        border-radius: 100px;
        text-shadow: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        backdrop-filter: blur(4px);
        letter-spacing: 0.3px;
      }

      .bye-week {
        background: rgba(255,255,255,0.15);
        color: rgba(255,255,255,0.6);
      }

      .live-badge {
        font-family: 'Bungee', cursive;
        background: #dc2626;
        color: white;
        font-size: 9px;
        padding: 2px 6px;
        border-radius: 100px;
        letter-spacing: 1px;
        animation: pulse 1.5s ease-in-out infinite;
        text-transform: uppercase;
      }

      .game-info.live {
        background: rgba(220, 38, 38, 0.15);
        color: white;
        border: 1px solid rgba(220, 38, 38, 0.4);
      }

      .h2h-badge {
        font-family: 'Bungee', cursive;
        background: #fbbf24;
        color: #111;
        font-size: 9px;
        padding: 2px 8px;
        border-radius: 100px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        white-space: nowrap;
      }

      span[winner] {
        font-weight: bold;
        font-size: 16px;
      }

      /* ── Leftovers ── */

      .item.leftovers {
        opacity: 0.6;
      }

      .item.leftovers .player-header {
        padding: 8px 10px 0;
      }

      .item.leftovers .player-name {
        font-size: 20px;
        color: #94a3b8;
      }

      .item.leftovers .win-count {
        font-size: 22px;
        color: #475569;
      }

      .item.leftovers .win-label {
        color: #475569;
      }

      .item.leftovers .team-link {
        padding: 8px 12px 8px 6px;
        margin: 3px 8px;
        font-size: 16px;
        border-radius: 8px;
      }

      .item.leftovers .team-wins-num {
        font-size: 18px;
      }

      .item.leftovers .logo img {
        width: 36px;
        height: 36px;
      }

      .item.leftovers .logo {
        min-width: 48px;
      }

      /* ── Footer ── */

      footer {
        background: #161922;
        border-top: 2px solid rgba(255,255,255,0.06);
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }

      .footer-link {
        font-family: 'Bungee', cursive;
        font-size: 11px;
        background: rgba(255,60,80,0.1);
        color: #ff3c50;
        border: 2px solid rgba(255,60,80,0.3);
        border-radius: 100px;
        padding: 8px 20px;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .footer-link:hover {
        background: #ff3c50;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(255,60,80,0.3);
      }

      footer select {
        background: rgba(255,255,255,0.06);
        color: #94a3b8;
        border: 2px solid rgba(255,255,255,0.1);
        border-radius: 100px;
        padding: 8px 16px;
        font-size: 13px;
        font-family: 'Saira Condensed', sans-serif;
        font-weight: 600;
        cursor: pointer;
        letter-spacing: 1px;
      }

      footer select option {
        background: #161922;
        color: #e2e8f0;
      }

      /* ── Responsive ── */

      @media (max-width: 600px) {
        h1 {
          font-size: 22px;
          letter-spacing: 1px;
        }

        .week-badge {
          font-size: 12px;
          padding: 4px 10px;
        }

        .player-name {
          font-size: 22px;
        }

        .win-count {
          font-size: 28px;
        }

        .rank {
          font-size: 24px;
          min-width: 28px;
        }

        .team-link {
          font-size: 17px;
          padding: 10px 10px 10px 6px;
          gap: 10px;
          margin: 5px 8px;
          border-radius: 10px;
        }

        .team-wins-num {
          font-size: 20px;
        }

        .grid {
          grid-template-columns: 1fr;
        }

        .item.leftovers .team-link {
          font-size: 14px;
          padding: 6px 8px 6px 4px;
          border-radius: 6px;
        }

        .item.leftovers .player-name {
          font-size: 18px;
        }

        .item.leftovers .win-count {
          font-size: 18px;
        }

        .item.leftovers .logo img {
          width: 28px;
          height: 28px;
        }

        .item.leftovers .team-wins-num {
          font-size: 14px;
        }
      }
    `
  }

  getHeadToHead(team) {
    if (!this.headToHeadMatchups || !team.nextGame) return null
    const gameId = team.nextGame.uid || team.nextGame.id
    return this.headToHeadMatchups.get(gameId) || null
  }

  getH2HOpponent(team) {
    const matchup = this.getHeadToHead(team)
    if (!matchup) return null
    return matchup.team1 === team.abbreviation
      ? matchup.player2
      : matchup.player1
  }

  getRankedStats() {
    if (!this.stats) return []
    const mapped = [...this.stats].map(draft => ({...draft, totalWins: this.getTotalWins(draft)}))
    const players = mapped.filter(d => d.name !== 'LEFTOVERS').sort((a, b) => b.totalWins - a.totalWins)
    const leftovers = mapped.find(d => d.name === 'LEFTOVERS')
    if (leftovers) players.push(leftovers)
    return players
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading-screen">
          <h1>Loading...</h1>
          <div class="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      `
    }

    const ranked = this.getRankedStats()
    const maxWins = Math.max(...ranked.filter(d => d.name !== 'LEFTOVERS').map(d => d.totalWins), 1)

    return html`
      <header>
        <div class="header-top">
          <h1>Loyd Family ${this.selectedYear} Wins</h1>
          ${this.selectedYear === 2025 ? html`<span class="week-badge">Wk ${api.week}</span>` : ''}
        </div>
      </header>
      <div class="grid">
      ${ranked.map((draft, i) => html`
        <div class="item ${draft.name === 'LEFTOVERS' ? 'leftovers' : ''}">
          <div class="player-header">
            ${draft.name !== 'LEFTOVERS' ? html`<div class="rank rank-${i + 1}">${i + 1}</div>` : ''}
            <div class="player-name">${draft.name}</div>
            <div class="win-badge">
              <div class="win-count">${draft.totalWins}</div>
              <div class="win-label">wins</div>
            </div>
          </div>
          ${draft.name !== 'LEFTOVERS' ? html`
            <div class="win-bar">
              <div class="win-fill" style="width: ${draft.totalWins / maxWins * 100}%"></div>
            </div>
          ` : ''}
          <div class="separator"></div>
          <ul>
            ${draft.teams.sort((a, b) => b.wins - a.wins).map(team => html`
              <li style="--team-color: #${team.color}; --alternate-color: #${team.alternateColor}">
              <a class="team-link ${this.getHeadToHead(team) ? 'h2h' : ''}" href="${team.links[3].href}">
                <div class="logo">
                  <img src="${team.logos[0].href}" alt="${team.nickname}" width="50" height="50">
                  <span class="record">${team.record}</span>
                </div>
                <div class="team-info">
                  <div class="team-name-wins">
                    <span>${team.shortDisplayName}</span>
                    <span class="team-wins-num">${team.wins}</span>
                    <span class="team-wins-label">${team.wins === 1 ? 'win' : 'wins'}</span>
                  </div>
                  <div class="game-info ${!team.nextGame ? 'bye-week' : ''} ${team.nextGame?.competitions?.[0]?.status?.type?.name === 'STATUS_IN_PROGRESS' ? 'live' : ''}">
                    ${team.nextGame ? html`
                      ${this.getHeadToHead(team) ? html`<span class="h2h-badge">vs ${this.getH2HOpponent(team)}</span>` : ''}
                      ${this.getStatus(team.nextGame?.competitions[0], team.nextGame?.shortName)}
                    ` : html`Bye Week`}
                  </div>
                </div>
              </a>
              </li>
            `)}
          </ul>
        </div>
      `)}
      </div>
      <footer>
        <a href="picks.html" class="footer-link">Draft Picker</a>
        <select .value=${this.selectedYear} @change=${this.handleYearChange}>
          ${this.availableYears.map(year => html`
            <option value="${year}" ?selected=${year === this.selectedYear}>${year}</option>
          `)}
        </select>
      </footer>
    `;
  }
}
customElements.define('my-list', MyList);
