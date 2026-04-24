import { LitElement, html, css } from 'lit';

export class WdCard extends LitElement {
  static properties = {
    elevated: { type: Boolean },
  };

  constructor() {
    super();
    this.elevated = false;
  }

  static styles = css`
    :host { display: block; }

    .card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      padding: var(--space-5);
    }

    .card.elevated {
      background: var(--color-surface-raised);
      border-color: var(--color-border-strong);
      box-shadow: var(--shadow-md);
    }
  `;

  render() {
    return html`
      <div class="card ${this.elevated ? 'elevated' : ''}">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('wd-card', WdCard);
