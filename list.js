import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {api, loadAllStats} from './controller.js';

class MyList extends LitElement {
  static get properties() {
    return {
      totalWins: {type: Number},
      loading: {type: Boolean}
    };
  }
  constructor() {
    super();
    this.loading = true
    this.loadStats()
  }

  loadStats() {
    loadAllStats().then(stats => {
        this.stats = stats
        this.loading = false
    })
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
      const score1 = `${game.competitors[0].team.abbreviation} ${game.competitors[0].score}`
      const score2 = `${game.competitors[1].team.abbreviation} ${game.competitors[1].score}`
      return `In progress. Current score: ${score1} - ${score2}`
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
        font-family: "Roboto", sans-serif;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        background-color: white;
      }
      header {
        font-family: "Anton", sans-serif;
        background: #d00;
        padding: 16px 2px;
        font-style: italic;
        position: sticky;
        top: -122px;
      }
      .nav-link {
        color: white;
        text-decoration: none;
        background: rgba(255,255,255,0.2);
        padding: 8px 16px;
        border-radius: 5px;
        font-size: 14px;
        margin: 10px auto;
        display: inline-block;
        transition: background 0.3s;
      }
      .nav-link:hover {
        background: rgba(255,255,255,0.3);
      }
      h1 {
        color: white;
        font-size: 48px;
        text-align: center;
        margin: 0;
      }
      h3 {
        color: white;
        text-align: center;
        margin: 0;
        font-size: 24px;
      }
      h2 {
        font-family: "Anton", sans-serif;
        font-size: 42px;
        font-weight: bold;
        margin-bottom: -14px;
        margin-top: 8px;
        padding-left: 4px;
      }
      a {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 16px;
        background: linear-gradient(155deg, var(--team-color) 55%, var(--alternate-color) 50%);
        padding: 16px;
        padding-left: 8px;
        border-left: 16px solid var(--alternate-color);
        font-size: 26px;
        font-weight: bold;
        color: white;
        margin: 4px;
        text-shadow: -2px -2px 0 var(--team-color), 2px -2px 0 var(--team-color), -2px 2px 0 var(--team-color), 2px 2px 0 var(--team-color);
      }
      span[winner] {
        font-weight: bold;
        font-size: 16px;
      }
      .record {
        font-size: 14px;
        font-weight: normal;
        font-family: "Anton", sans-serif;
      }
      li > div {
        background: var(--team-color)00033;
        padding: 6px;
        border-radius: 6px;
      }
      .logo {
        background: none;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .game-info {
        font-size: 14px;
        font-weight: normal;
        margin-top: 8px;
        color: black;
        background: #ffffffaa;
        padding: 2px 8px;
        border-radius: 2px;
        text-shadow: none;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }
      @media (max-width: 600px) {
        h1 {
          font-size: 36px;
        }
      }
    `
  }

  render() {
    if (this.loading) {
      return html`<h1>Loading...</h1>`
    }

    return html`
      <header>
        <h1>Loyd Family 2025 Wins</h1>
        <h3>Week ${api.week}</h3>
        <div style="text-align: center;">
          <a href="picks.html" class="nav-link">Draft Picks</a>
        </div>
      </header>
      <div class="grid">
      ${this.stats.map(draft => html`
        <div class="item" >
          <h2>${draft.name}: ${this.getTotalWins(draft)}</h2>
          <ul>
            ${draft.teams.sort((a, b) => b.wins - a.wins).map(team => html`
              <li style="--team-color: #${team.color}; --alternate-color: #${team.alternateColor}">
              <a href="${team.links[3].href}">
                <div class=logo>
                  <img src="${team.logos[0].href}" alt="${team.nickname}" width="50" height="50">
                  <span class="record">${team.record}</span>
                </div>
                <div>
                  <div>${team.shortDisplayName} - ${team.wins} ${team.wins === 1 ? `win` : `wins`}</div>
                  <div class="game-info">
                    ${team.nextGame ? html`
                      ${this.getStatus(team.nextGame?.competitions[0], team.nextGame?.shortName)}
                    ` : html`Bye Week`}
                  </div>
                </div>
              </a>
              </li>
            `)}
          </ul>
        </div>
      </div>
      `)}
    `;
  }
}
customElements.define('my-list', MyList);