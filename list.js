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

  static get styles() {
    return css`
      :host {
        font-family: "Roboto", sans-serif;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
      header {
        font-family: "Anton", sans-serif;
        background: #d00;
        padding: 16px 2px;
        font-style: italic;
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
        <h1>Loyd Family 2024 Wins Draft </h1>
        <h3>Week ${api.week}</h3>
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
                      ${team.nextGame?.shortName} - ${team.nextGame?.competitions[0].status.type.detail}
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