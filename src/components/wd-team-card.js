import { LitElement, html, css } from 'lit';
import './wd-badge.js';

export class WdTeamCard extends LitElement {
  static properties = {
    name: { type: String },
    abbreviation: { type: String },
    logo: { type: String },
    wins: { type: Number },
    record: { type: String },
    color: { type: String },
    alternateColor: { type: String, attribute: 'alternate-color' },
    link: { type: String },
    gameStatus: { type: String, attribute: 'game-status' },
    gameInfo: { type: String, attribute: 'game-info' },
    gameScore: { type: String, attribute: 'game-score' },
    h2hOpponent: { type: String, attribute: 'h2h-opponent' },
    selected: { type: Boolean },
    selectable: { type: Boolean },
    compact: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.name = '';
    this.abbreviation = '';
    this.logo = '';
    this.wins = 0;
    this.record = '';
    this.color = '333333';
    this.alternateColor = '555555';
    this.link = '#';
    this.gameStatus = null;
    this.gameInfo = '';
    this.gameScore = '';
    this.h2hOpponent = '';
    this.selected = false;
    this.selectable = false;
    this.compact = false;
  }

  static styles = css`
    :host {
      display: block;
      margin: 0 var(--space-2);
    }

    :host(:nth-of-type(even)) .team {
      background: var(--color-surface);
    }

    .team {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      text-decoration: none;
      color: var(--color-text);
      border-left: none;
      padding-left: calc(var(--space-4) + 14px);
      background: var(--color-surface-raised);
      border-bottom: 2px solid var(--color-border);
      transition: background var(--duration-fast), opacity var(--duration-fast);
      cursor: pointer;
      position: relative;
    }

    .team::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 12px;
      background: var(--tc);
    }

    .team::after {
      content: '';
      position: absolute;
      left: 3px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--tc2, var(--tc));
    }

    .team:hover {
      background: var(--color-surface-hover);
    }

    .team.h2h::before {
      background: var(--color-accent);
    }

    .team.h2h {
      box-shadow: inset 0 0 20px var(--color-accent-glow);
    }

    .team.selected {
      opacity: 0.2;
      pointer-events: none;
    }

    :host([compact]) .team {
      padding: var(--space-2) var(--space-3);
      gap: var(--space-2);
    }

    /* Logo column */
    .logo img {
      width: 44px;
      height: 44px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
    }

    :host([compact]) .logo img {
      width: 30px;
      height: 30px;
    }

    /* Info column */
    .info {
      min-width: 0;
    }

    .top-row {
      display: flex;
      align-items: baseline;
      gap: var(--space-2);
    }

    .team-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--text-base);
      white-space: nowrap;
    }

    :host([compact]) .team-name {
      font-size: var(--text-sm);
    }

    .team-record {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .bottom-row {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-top: 2px;
    }

    .game-text {
      font-size: var(--text-xs);
      color: var(--color-text-secondary);
    }

    .game-text.bye {
      color: var(--color-text-muted);
      font-style: italic;
    }

    .game-text.live {
      color: var(--color-live);
    }

    .winner { font-weight: 700; }

    /* Wins column */
    .wins-col {
      text-align: right;
      padding-left: var(--space-2);
    }

    .wins-num {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: var(--text-2xl);
      color: var(--color-accent);
      line-height: 1;
    }

    :host([compact]) .wins-num {
      font-size: var(--text-lg);
    }

    .wins-label {
      font-size: 9px;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    @media (max-width: 600px) {
      .logo img { width: 36px; height: 36px; }
      .team-name { font-size: var(--text-sm); }
      .wins-num { font-size: var(--text-xl); }
    }
  `;

  _renderGameInfo() {
    if (!this.gameStatus || this.gameStatus === 'offseason') return '';

    if (this.gameStatus === 'bye') {
      return html`<span class="game-text bye">Bye Week</span>`;
    }

    if (this.gameStatus === 'live') {
      return html`
        <wd-badge variant="live" pulse>LIVE</wd-badge>
        <span class="game-text live">${this.gameScore}</span>
      `;
    }

    if (this.gameStatus === 'final') {
      return html`<span class="game-text">${this.gameScore}</span>`;
    }

    return html`<span class="game-text">${this.gameInfo}</span>`;
  }

  render() {
    const alt = this.alternateColor;
    const usableAlt = alt && alt !== 'ffffff' && alt !== '000000' ? alt : this.color;
    const style = `--tc: #${this.color}; --tc2: #${usableAlt};`;
    const classes = [
      'team',
      this.h2hOpponent ? 'h2h' : '',
      this.selected ? 'selected' : '',
    ].filter(Boolean).join(' ');

    const content = html`
      <div class="logo">
        ${this.logo ? html`<img src="${this.logo}" alt="${this.name}">` : ''}
      </div>
      <div class="info">
        <div class="top-row">
          <span class="team-name">${this.name}</span>
          <span class="team-record">${this.record}</span>
        </div>
        <div class="bottom-row">
          ${this.h2hOpponent ? html`<wd-badge variant="h2h">vs ${this.h2hOpponent}</wd-badge>` : ''}
          ${this._renderGameInfo()}
        </div>
      </div>
      <div class="wins-col">
        <div class="wins-num">${this.wins}</div>
        <div class="wins-label">${this.wins === 1 ? 'win' : 'wins'}</div>
      </div>
    `;

    if (this.selectable || !this.link || this.link === '#') {
      return html`<div class=${classes} style=${style}>${content}</div>`;
    }

    return html`<a class=${classes} style=${style} href=${this.link}>${content}</a>`;
  }
}

customElements.define('wd-team-card', WdTeamCard);
