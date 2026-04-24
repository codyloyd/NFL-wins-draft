import { LitElement, html, css } from 'lit';

export class WdPlayerTag extends LitElement {
  static properties = {
    name: { type: String },
    removable: { type: Boolean },
    active: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.name = '';
    this.removable = true;
    this.active = false;
  }

  _handleRemove() {
    this.dispatchEvent(new CustomEvent('remove', {
      detail: { name: this.name },
      bubbles: true,
      composed: true,
    }));
  }

  static styles = css`
    :host { display: inline-flex; }

    .tag {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--text-sm);
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 4px 12px;
      background: var(--color-surface-raised);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border-strong);
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      clip-path: polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%);
      transition: all var(--duration-fast);
    }

    :host([active]) .tag {
      background: var(--color-accent);
      color: var(--color-accent-text);
      border-color: var(--color-accent);
    }

    .remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      background: none;
      border: none;
      color: inherit;
      font-size: 14px;
      line-height: 1;
      cursor: pointer;
      padding: 0;
      opacity: 0.6;
      transition: opacity var(--duration-fast);
    }

    .remove:hover {
      opacity: 1;
    }
  `;

  render() {
    return html`
      <span class="tag">
        ${this.name}
        ${this.removable ? html`
          <button class="remove" @click=${this._handleRemove}>&times;</button>
        ` : ''}
      </span>
    `;
  }
}

customElements.define('wd-player-tag', WdPlayerTag);
