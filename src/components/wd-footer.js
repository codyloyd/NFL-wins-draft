import { LitElement, html, css } from 'lit';
import './wd-select.js';
import { THEMES, THEMES_LIGHT, THEME_KEYS, applyTheme, loadSavedTheme } from '../themes.js';

export class WdFooter extends LitElement {
  static properties = {
    years: { type: Array },
    selectedYear: { type: String, attribute: 'selected-year' },
    draftLink: { type: String, attribute: 'draft-link' },
    _activeTheme: { state: true },
    _mode: { state: true },
  };

  constructor() {
    super();
    this.years = [];
    this.selectedYear = '';
    this.draftLink = 'picks.html';
    this._activeTheme = 'slate';
    this._mode = 'dark';
  }

  connectedCallback() {
    super.connectedCallback();
    const { key, mode } = loadSavedTheme();
    this._activeTheme = key;
    this._mode = mode;
  }

  _setTheme(key) {
    this._activeTheme = key;
    applyTheme(key, this._mode);
  }

  _toggleMode() {
    this._mode = this._mode === 'dark' ? 'light' : 'dark';
    applyTheme(this._activeTheme, this._mode);
  }

  static styles = css`
    :host { display: block; }

    footer {
      background: var(--color-surface);
      border-top: 1px solid var(--color-border-strong);
      padding: var(--space-4) var(--space-6);
    }

    .row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-5);
      max-width: 1400px;
      margin: 0 auto;
    }

    .row + .row {
      margin-top: var(--space-3);
    }

    .draft-link {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--text-xs);
      color: var(--color-accent);
      border: 1px solid var(--color-accent);
      padding: 6px 18px;
      cursor: pointer;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 2px;
      transition: all var(--duration-fast);
      clip-path: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%);
      padding-left: 20px;
      padding-right: 20px;
    }

    .draft-link:hover {
      background: var(--color-accent);
      color: var(--color-accent-text);
    }

    .theme-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .theme-swatches {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .theme-swatch {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      transition: border-color var(--duration-fast), transform var(--duration-fast);
    }

    .theme-swatch:hover {
      transform: scale(1.2);
    }

    .theme-swatch.active {
      border-color: var(--color-text);
    }

    .mode-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      background: var(--color-surface-raised);
      border: 1px solid var(--color-border-strong);
      border-radius: 20px;
      padding: 3px 10px;
      transition: all var(--duration-fast);
    }

    .mode-toggle:hover {
      border-color: var(--color-accent);
    }

    .mode-icon {
      font-size: 13px;
      line-height: 1;
    }

    .mode-label {
      font-family: var(--font-display);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--color-text-secondary);
    }

    .divider {
      width: 1px;
      height: 14px;
      background: var(--color-border-strong);
    }
  `;

  render() {
    const yearOptions = this.years.map(y => ({ value: String(y), label: String(y) }));
    const swatchSource = this._mode === 'light' ? THEMES_LIGHT : THEMES;

    return html`
      <footer>
        <div class="row">
          <a href=${this.draftLink} class="draft-link">Draft Picker</a>
          <wd-select .options=${yearOptions} .value=${this.selectedYear}></wd-select>
        </div>
        <div class="row">
          <div class="theme-row">
            <div class="theme-swatches">
              ${THEME_KEYS.map(key => html`
                <div
                  class="theme-swatch ${this._activeTheme === key ? 'active' : ''}"
                  style="background: ${swatchSource[key].accent}"
                  title=${swatchSource[key].label}
                  @click=${() => this._setTheme(key)}
                ></div>
              `)}
            </div>
            <div class="divider"></div>
            <div class="mode-toggle" @click=${this._toggleMode}>
              <span class="mode-icon">${this._mode === 'dark' ? '☾' : '☀'}</span>
              <span class="mode-label">${this._mode}</span>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('wd-footer', WdFooter);
