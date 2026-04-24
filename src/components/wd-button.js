import { LitElement, html, css } from 'lit';

export class WdButton extends LitElement {
  static properties = {
    variant: { type: String },
    size: { type: String },
    disabled: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
    this.disabled = false;
  }

  static styles = css`
    :host { display: inline-block; }

    button {
      font-family: var(--font-display);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
      border: none;
      cursor: pointer;
      border-radius: var(--radius-sm);
      transition: all var(--duration-fast);
      line-height: 1;
      white-space: nowrap;
      position: relative;
    }

    button:active:not(:disabled) {
      transform: scale(0.97);
    }

    button.sm { font-size: var(--text-xs); padding: 6px 14px; }
    button.md { font-size: var(--text-sm); padding: 10px 20px; }
    button.lg { font-size: var(--text-base); padding: 14px 28px; }

    button.primary {
      background: var(--color-accent);
      color: var(--color-accent-text);
      clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%);
      padding-left: 24px;
      padding-right: 24px;
    }

    button.primary:hover:not(:disabled) {
      background: var(--color-accent-bright);
      box-shadow: var(--shadow-glow);
    }

    button.secondary {
      background: transparent;
      color: var(--color-accent);
      border: 2px solid var(--color-accent);
      clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%);
      padding-left: 22px;
      padding-right: 22px;
    }

    button.secondary:hover:not(:disabled) {
      background: var(--color-accent-glow);
    }

    button.ghost {
      background: var(--color-surface-raised);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border-strong);
    }

    button.ghost:hover:not(:disabled) {
      color: var(--color-accent);
      border-color: var(--color-accent);
      background: var(--color-accent-glow);
    }

    button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  `;

  render() {
    return html`
      <button class="${this.variant} ${this.size}" ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('wd-button', WdButton);
