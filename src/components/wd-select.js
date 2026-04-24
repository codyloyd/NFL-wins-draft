import { LitElement, html, css } from 'lit';

export class WdSelect extends LitElement {
  static properties = {
    options: { type: Array },
    value: { type: String },
  };

  constructor() {
    super();
    this.options = [];
    this.value = '';
  }

  _handleChange(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('wd-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  static styles = css`
    :host { display: inline-block; }

    select {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--text-sm);
      letter-spacing: 1px;
      color: var(--color-accent);
      background: var(--color-surface);
      border: 1px solid var(--color-accent);
      border-radius: 0;
      padding: 6px 32px 6px 12px;
      cursor: pointer;
      outline: none;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%237ca0c4' stroke-width='3'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      text-transform: uppercase;
      transition: all var(--duration-fast);
    }

    select:hover, select:focus {
      background: var(--color-accent-glow);
    }

    option {
      background: var(--color-surface);
      color: var(--color-text);
    }
  `;

  render() {
    return html`
      <select .value=${this.value} @change=${this._handleChange}>
        ${this.options.map(opt => html`
          <option value=${opt.value} ?selected=${opt.value === this.value}>${opt.label}</option>
        `)}
      </select>
    `;
  }
}

customElements.define('wd-select', WdSelect);
