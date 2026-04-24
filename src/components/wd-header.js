import { LitElement, html, css } from 'lit';

export class WdHeader extends LitElement {
  static properties = {
    year: { type: Number },
    week: { type: Number },
    showWeek: { type: Boolean, attribute: 'show-week' },
  };

  constructor() {
    super();
    this.year = 2025;
    this.week = 0;
    this.showWeek = false;
  }

  static styles = css`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    header {
      background: var(--color-surface);
      border-bottom: 3px solid var(--color-accent);
      padding: var(--space-4) var(--space-6);
      position: relative;
    }

    header::before {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--color-accent);
      box-shadow: 0 0 20px var(--color-accent), 0 0 60px rgba(180, 240, 78, 0.15);
    }

    .inner {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      font-family: var(--font-display);
      font-weight: 900;
      font-style: italic;
      font-size: var(--text-3xl);
      color: var(--color-text);
      text-transform: uppercase;
      letter-spacing: 3px;
      line-height: 1;
      margin: 0;
    }

    .year {
      color: var(--color-accent);
    }

    .week {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--text-sm);
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 2px;
      border: 1px solid var(--color-accent);
      padding: 4px 14px;
    }

    @media (max-width: 600px) {
      h1 { font-size: var(--text-xl); letter-spacing: 1px; }
      .week { font-size: var(--text-xs); padding: 3px 10px; }
    }
  `;

  render() {
    return html`
      <header>
        <div class="inner">
          <h1>Loyd Family <span class="year">${this.year}</span> Wins</h1>
          ${this.showWeek && this.week ? html`
            <span class="week">Wk ${this.week}</span>
          ` : ''}
        </div>
      </header>
    `;
  }
}

customElements.define('wd-header', WdHeader);
