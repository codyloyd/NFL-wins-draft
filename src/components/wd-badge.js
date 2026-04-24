import { LitElement, html, css } from 'lit';

export class WdBadge extends LitElement {
  static properties = {
    variant: { type: String },
    pulse: { type: Boolean },
  };

  constructor() {
    super();
    this.variant = 'record';
    this.pulse = false;
  }

  static styles = css`
    :host { display: inline-flex; }

    .badge {
      font-family: var(--font-display);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 2px 8px;
      font-size: var(--text-xs);
      line-height: 1.5;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .rank-1 {
      background: var(--color-rank-1);
      color: #1a1400;
      clip-path: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%);
      padding: 3px 12px;
      font-size: var(--text-sm);
    }

    .rank-2 {
      background: var(--color-rank-2);
      color: #1a1e22;
      clip-path: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%);
      padding: 3px 12px;
      font-size: var(--text-sm);
    }

    .rank-3 {
      background: var(--color-rank-3);
      color: #1a0e00;
      clip-path: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%);
      padding: 3px 12px;
      font-size: var(--text-sm);
    }

    .live {
      background: var(--color-live);
      color: white;
      border-radius: var(--radius-sm);
      font-size: 9px;
      letter-spacing: 2px;
    }

    .live.pulse {
      animation: blink 2.5s ease-in-out infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .h2h {
      background: var(--color-accent);
      color: var(--color-accent-text);
      border-radius: var(--radius-sm);
      font-size: 9px;
      letter-spacing: 1px;
    }

    .bye {
      background: transparent;
      color: var(--color-text-muted);
      border: 1px solid var(--color-border-strong);
      border-radius: var(--radius-sm);
    }

    .record {
      background: rgba(0, 0, 0, 0.6);
      color: var(--color-text-secondary);
      font-family: var(--font-body);
      font-weight: 600;
      font-size: var(--text-xs);
      letter-spacing: 0.5px;
      border-radius: var(--radius-sm);
    }
  `;

  render() {
    return html`
      <span class="badge ${this.variant} ${this.pulse ? 'pulse' : ''}">
        <slot></slot>
      </span>
    `;
  }
}

customElements.define('wd-badge', WdBadge);
