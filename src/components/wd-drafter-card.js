import { LitElement, html, css } from 'lit';
import './wd-win-bar.js';

export class WdDrafterCard extends LitElement {
  static properties = {
    name: { type: String },
    rank: { type: Number },
    totalWins: { type: Number, attribute: 'total-wins' },
    maxWins: { type: Number, attribute: 'max-wins' },
    isLeftovers: { type: Boolean, reflect: true, attribute: 'is-leftovers' },
  };

  constructor() {
    super();
    this.name = '';
    this.rank = 0;
    this.totalWins = 0;
    this.maxWins = 1;
    this.isLeftovers = false;
  }

  static styles = css`
    :host {
      display: block;
      animation: enter 0.4s var(--ease-out) both;
    }

    :host([is-leftovers]) {
      opacity: 0.45;
    }

    @keyframes enter {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      overflow: hidden;
    }

    .head {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4) var(--space-4) var(--space-3);
    }

    .rank {
      font-family: var(--font-display);
      font-weight: 900;
      font-style: italic;
      font-size: var(--text-4xl);
      min-width: 44px;
      text-align: center;
      line-height: 1;
      color: var(--color-text-muted);
    }

    .rank-1 { color: var(--color-rank-1); }
    .rank-2 { color: var(--color-rank-2); }
    .rank-3 { color: var(--color-rank-3); }

    .player-name {
      font-family: var(--font-display);
      font-weight: 900;
      font-style: italic;
      font-size: var(--text-2xl);
      color: var(--color-text);
      text-transform: uppercase;
      letter-spacing: 3px;
      line-height: 1;
    }

    :host([is-leftovers]) .player-name {
      font-size: var(--text-lg);
      color: var(--color-text-muted);
      font-style: normal;
      letter-spacing: 2px;
    }

    .win-total {
      margin-left: auto;
      text-align: right;
    }

    .win-num {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: var(--text-4xl);
      color: var(--color-accent);
      line-height: 1;
    }

    :host([is-leftovers]) .win-num {
      font-size: var(--text-xl);
      color: var(--color-text-muted);
    }

    .win-label {
      font-size: 9px;
      font-weight: 700;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 3px;
      text-align: right;
    }

    .bar-wrap {
      padding: 0 var(--space-4) var(--space-3);
    }

    .divider {
      height: 1px;
      background: var(--color-border-strong);
      margin: 0 var(--space-4);
    }

    .teams {
      padding: var(--space-2) 0 var(--space-3);
    }

    @media (max-width: 600px) {
      .player-name { font-size: var(--text-xl); letter-spacing: 2px; }
      .win-num { font-size: var(--text-3xl); }
      .rank { font-size: var(--text-3xl); min-width: 36px; }
    }
  `;

  render() {
    return html`
      <div class="card">
        <div class="head">
          ${!this.isLeftovers ? html`
            <div class="rank rank-${this.rank}">${this.rank}</div>
          ` : ''}
          <div class="player-name">${this.name}</div>
          <div class="win-total">
            <div class="win-num">${this.totalWins}</div>
            <div class="win-label">wins</div>
          </div>
        </div>

        ${!this.isLeftovers ? html`
          <div class="bar-wrap">
            <wd-win-bar .value=${this.totalWins} .max=${this.maxWins}></wd-win-bar>
          </div>
        ` : ''}

        <div class="divider"></div>

        <div class="teams">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('wd-drafter-card', WdDrafterCard);
