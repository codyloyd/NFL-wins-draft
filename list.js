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

    // === MOCK DATA — remove after demo ===
    const fakeGame = {
      uid: 'mock-buf-phi',
      id: 'mock-buf-phi',
      shortName: 'BUF @ PHI',
      status: { type: { name: 'STATUS_IN_PROGRESS' } },
      competitions: [{
        status: { type: { name: 'STATUS_IN_PROGRESS' } },
        competitors: [
          { team: { abbreviation: 'PHI' }, score: '21', winner: false },
          { team: { abbreviation: 'BUF' }, score: '24', winner: false }
        ],
        date: new Date().toISOString()
      }]
    }
    for (const draft of stats) {
      for (const team of draft.teams) {
        if (team.abbreviation === 'BUF' || team.abbreviation === 'PHI') {
          team.nextGame = fakeGame
        }
      }
    }
    // === END MOCK DATA ===

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
    // IF STATUS_FINAL or STATUS_IN_PROGRESS
    const status = game.status.type.name
    const date = new Date(game.date)

    if (status === 'STATUS_FINAL') {
      const score1 = html`<span ?winner=${game.competitors[0].winner}>${game.competitors[0].team.abbreviation} ${game.competitors[0].score}</span>`
      const score2 = html`<span ?winner=${game.competitors[1].winner}>${game.competitors[1].team.abbreviation} ${game.competitors[1].score}</span>`
      return html`Final score: ${score1} - ${score2}`
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
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      :host {
        font-family: "Roboto", sans-serif;
      }
      .loading-screen {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        gap: 16px;
      }
      .loading-screen h1 {
        color: white;
        font-family: "Teko", sans-serif;
        font-size: 36px;
        text-transform: uppercase;
        letter-spacing: 2px;
        animation: pulse 1.5s ease-in-out infinite;
        margin: 0;
      }
      .loading-dots {
        display: flex;
        gap: 8px;
      }
      .loading-dots span {
        width: 12px;
        height: 12px;
        background: #d00;
        border-radius: 50%;
        animation: pulse 1.4s ease-in-out infinite;
      }
      .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
      .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        background-color: #111;
        gap: 2px;
        max-width: 1400px;
        margin: 0 auto;
      }
      .item {
        background: #1a1a1a;
        padding-bottom: 16px;
        animation: slideUp 0.4s ease-out both;
      }
      .item:nth-child(2) { animation-delay: 0.05s; }
      .item:nth-child(3) { animation-delay: 0.1s; }
      .item:nth-child(4) { animation-delay: 0.15s; }
      .item:nth-child(5) { animation-delay: 0.2s; }
      .player-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 8px 0;
      }
      .rank {
        font-family: "Teko", sans-serif;
        font-size: 28px;
        color: #555;
        min-width: 32px;
        text-align: center;
        line-height: 1;
      }
      .rank.rank-1 { color: #ffd700; }
      .rank.rank-2 { color: #c0c0c0; }
      .rank.rank-3 { color: #cd7f32; }
      .player-name {
        font-family: "Teko", sans-serif;
        font-size: 36px;
        font-weight: bold;
        color: white;
        text-transform: uppercase;
        letter-spacing: 1px;
        line-height: 1;
      }
      .win-count {
        font-family: "Teko", sans-serif;
        font-size: 36px;
        color: #ff4444;
        line-height: 1;
      }
      .win-label {
        font-family: "Roboto", sans-serif;
        font-size: 11px;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: 2px;
      }
      .win-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: auto;
        padding-right: 12px;
      }
      header {
        font-family: "Teko", sans-serif;
        background:
          radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 1px, transparent 1px),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 1px, transparent 1px),
          radial-gradient(circle at 50% 80%, rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(135deg, #c00 0%, #d00 40%, #a00 100%);
        background-size: 6px 6px, 6px 6px, 6px 6px, 100% 100%;
        padding: 14px 16px 12px;
        font-style: italic;
        position: sticky;
        top: 0;
        z-index: 10;
        box-shadow: 0 4px 24px rgba(0,0,0,0.5);
        border-bottom: 4px solid #ff4444;
      }
      .header-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      footer {
        background: #1a1a1a;
        border-top: 1px solid #333;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        font-style: normal;
      }
      .footer-link {
        font-family: "Roboto", sans-serif;
        font-weight: 500;
        background: rgba(255,255,255,0.08);
        color: #888;
        border: 1px solid #333;
        border-radius: 6px;
        padding: 8px 16px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .footer-link:hover {
        background: rgba(255,255,255,0.15);
        color: #ccc;
      }
      footer select {
        background: rgba(255,255,255,0.08);
        color: #888;
        border: 1px solid #333;
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 12px;
        font-family: "Roboto", sans-serif;
        cursor: pointer;
      }
      footer select option {
        background: #1a1a1a;
        color: #ccc;
      }
      h1 {
        color: white;
        font-size: 52px;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 3px;
        text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        line-height: 1;
      }
      .week-badge {
        font-family: "Teko", sans-serif;
        font-style: normal;
        font-size: 22px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 1px;
        background: rgba(255,255,255,0.15);
        padding: 2px 10px;
        border-radius: 4px;
        color: rgba(255,255,255,0.9);
        white-space: nowrap;
        line-height: 1.2;
      }
      .team-link {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 14px;
        background: linear-gradient(155deg, var(--team-color) 55%, var(--alternate-color) 50%);
        padding: 12px 16px 12px 8px;
        border-left: 5px solid var(--alternate-color);
        font-size: 22px;
        font-weight: bold;
        color: white;
        margin: 5px 8px;
        border-radius: 8px;
        text-shadow: 0 1px 3px rgba(0,0,0,0.5), 0 0 8px rgba(0,0,0,0.2);
        transition: transform 0.15s, box-shadow 0.15s;
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
        background: linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 50%, transparent 100%);
        pointer-events: none;
        z-index: 1;
      }
      .team-link:hover {
        transform: translateX(4px) scale(1.01);
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      }
      span[winner] {
        font-weight: bold;
        font-size: 16px;
      }
      .record {
        font-size: 12px;
        font-weight: normal;
        font-family: "Teko", sans-serif;
        letter-spacing: 0.5px;
        background: rgba(0,0,0,0.5);
        padding: 2px 6px;
        border-radius: 3px;
        margin-top: 4px;
      }
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
        font-size: 28px;
        line-height: 1;
      }
      .team-wins-label {
        font-size: 13px;
        font-weight: 400;
        opacity: 0.8;
        text-shadow: none;
      }
      .game-info {
        font-size: 12px;
        font-weight: 500;
        margin-top: 6px;
        color: #222;
        background: rgba(255,255,255,0.92);
        padding: 4px 10px;
        border-radius: 4px;
        text-shadow: none;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        backdrop-filter: blur(4px);
      }
      .bye-week {
        background: rgba(255,255,255,0.2);
        color: rgba(255,255,255,0.7);
      }
      .live-badge {
        background: #d00;
        color: white;
        font-size: 9px;
        font-weight: 700;
        padding: 2px 5px;
        border-radius: 3px;
        letter-spacing: 1px;
        animation: pulse 1.5s ease-in-out infinite;
        text-transform: uppercase;
      }
      .game-info.live {
        background: rgba(255,68,68,0.12);
        color: white;
        border: 1px solid rgba(255,68,68,0.4);
      }
      .h2h-badge {
        background: #ffd700;
        color: #111;
        font-size: 9px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 3px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        white-space: nowrap;
      }
      .team-link.h2h {
        box-shadow: 0 0 0 2px #ffd700, 0 2px 12px rgba(255,215,0,0.25);
      }
      .item.leftovers {
        opacity: 0.7;
      }
      .item.leftovers .player-header {
        padding: 8px 8px 0;
      }
      .item.leftovers .player-name {
        font-size: 24px;
        color: #999;
      }
      .item.leftovers .win-count {
        font-size: 24px;
        color: #666;
      }
      .item.leftovers .win-label {
        color: #555;
      }
      .item.leftovers .team-link {
        padding: 8px 12px 8px 6px;
        margin: 3px 8px;
        font-size: 16px;
      }
      .item.leftovers .team-wins-num {
        font-size: 20px;
      }
      .item.leftovers .logo img {
        width: 36px;
        height: 36px;
      }
      .item.leftovers .logo {
        min-width: 48px;
      }
      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }
      .separator {
        height: 1px;
        background: linear-gradient(90deg, transparent, #333, transparent);
        margin: 0 16px;
      }
      @media (max-width: 600px) {
        h1 {
          font-size: 28px;
          letter-spacing: 1px;
        }
        .week-badge {
          font-size: 16px;
          padding: 2px 8px;
        }
        .player-name {
          font-size: 28px;
        }
        .win-count {
          font-size: 28px;
        }
        .rank {
          font-size: 22px;
          min-width: 24px;
        }
        .team-link {
          font-size: 18px;
          padding: 10px 10px 10px 6px;
          gap: 10px;
        }
        .team-wins-num {
          font-size: 22px;
        }
        .grid {
          grid-template-columns: 1fr;
        }
        .item.leftovers .team-link {
          font-size: 14px;
          padding: 6px 8px 6px 4px;
        }
        .item.leftovers .player-name {
          font-size: 20px;
        }
        .item.leftovers .win-count {
          font-size: 20px;
        }
        .item.leftovers .logo img {
          width: 28px;
          height: 28px;
        }
        .item.leftovers .team-wins-num {
          font-size: 16px;
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