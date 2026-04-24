import { LitElement, html, css } from 'lit';

export class WdLoading extends LitElement {
  static properties = {
    _offset: { state: true },
  };

  constructor() {
    super();
    this._offset = 0;
    this._raf = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const step = () => {
      this._offset = (this._offset + 0.4) % 200;
      this._raf = requestAnimationFrame(step);
    };
    this._raf = requestAnimationFrame(step);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    cancelAnimationFrame(this._raf);
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: var(--space-6);
      user-select: none;
    }

    .field {
      width: 240px;
      height: 6px;
      background: var(--color-surface-raised);
      position: relative;
      overflow: hidden;
      border: 1px solid var(--color-border-strong);
    }

    .yard-lines {
      position: absolute;
      inset: 0;
      display: flex;
    }

    .yard {
      flex: 1;
      border-right: 1px solid var(--color-border-strong);
    }

    .yard:last-child { border-right: none; }

    .runner {
      position: absolute;
      top: 0;
      width: 24px;
      height: 100%;
      background: var(--color-accent);
      opacity: 0.7;
      transition: none;
    }

    .runner::after {
      content: '';
      position: absolute;
      right: -12px;
      top: 0;
      width: 12px;
      height: 100%;
      background: linear-gradient(90deg, var(--color-accent), transparent);
      opacity: 0.4;
    }

    .tagline {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--text-xs);
      text-transform: uppercase;
      letter-spacing: 5px;
      color: var(--color-text-muted);
      animation: flicker 2s ease-in-out infinite;
    }

    @keyframes flicker {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
  `;

  render() {
    const runnerLeft = (this._offset / 200) * 240;

    return html`
      <div class="field">
        <div class="yard-lines">
          ${Array.from({ length: 10 }, () => html`<div class="yard"></div>`)}
        </div>
        <div class="runner" style="left: ${runnerLeft}px"></div>
      </div>
      <div class="tagline">Loading</div>
    `;
  }
}

customElements.define('wd-loading', WdLoading);
