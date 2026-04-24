import { LitElement, html, css } from 'lit';

export class WdInput extends LitElement {
  static properties = {
    placeholder: { type: String },
    value: { type: String },
    type: { type: String },
  };

  constructor() {
    super();
    this.placeholder = '';
    this.value = '';
    this.type = 'text';
  }

  _handleInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('wd-input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  _handleKeydown(e) {
    if (e.key === 'Enter') {
      this.dispatchEvent(new CustomEvent('wd-submit', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }));
    }
  }

  static styles = css`
    :host { display: block; }

    input {
      font-family: var(--font-body);
      font-size: var(--text-base);
      font-weight: 500;
      color: var(--color-text);
      background: var(--color-bg);
      border: 1px solid var(--color-border-strong);
      border-bottom: 2px solid var(--color-text-muted);
      border-radius: 0;
      padding: var(--space-3) var(--space-4);
      width: 100%;
      outline: none;
      transition: border-color var(--duration-fast);
    }

    input::placeholder {
      color: var(--color-text-muted);
    }

    input:focus {
      border-bottom-color: var(--color-accent);
    }
  `;

  render() {
    return html`
      <input
        type=${this.type}
        .value=${this.value}
        placeholder=${this.placeholder}
        @input=${this._handleInput}
        @keydown=${this._handleKeydown}
      />
    `;
  }
}

customElements.define('wd-input', WdInput);
