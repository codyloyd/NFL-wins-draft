import { LitElement, html, css } from 'lit';

export class WdWinBar extends LitElement {
  static properties = {
    value: { type: Number },
    max: { type: Number },
    animated: { type: Boolean },
  };

  constructor() {
    super();
    this.value = 0;
    this.max = 1;
    this.animated = true;
  }

  get percentage() {
    if (this.max <= 0) return 0;
    return Math.min((this.value / this.max) * 100, 100);
  }

  static styles = css`
    :host { display: block; }

    .track {
      height: 3px;
      background: var(--color-border-strong);
      position: relative;
      overflow: hidden;
    }

    .fill {
      height: 100%;
      background: var(--color-accent);
      transform-origin: left;
      position: relative;
    }

    .fill.animated {
      animation: grow 0.6s var(--ease-out) 0.2s both;
    }

    .notch {
      position: absolute;
      right: 0;
      top: -3px;
      width: 3px;
      height: 9px;
      background: var(--color-accent-bright);
    }

    @keyframes grow {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }
  `;

  render() {
    return html`
      <div class="track">
        <div
          class="fill ${this.animated ? 'animated' : ''}"
          style="width: ${this.percentage}%"
        >
          ${this.percentage > 0 ? html`<div class="notch"></div>` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('wd-win-bar', WdWinBar);
