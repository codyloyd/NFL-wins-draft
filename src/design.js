import { LitElement, html, css } from 'lit';
import './components/index.js';

class DesignGuide extends LitElement {
  static properties = {
    activeTheme: { type: String },
  };

  constructor() {
    super();
    this.activeTheme = 'slate';
  }

  static THEMES = {
    ice: {
      label: 'Ice',
      desc: 'Arctic blue — cold, sharp, electric',
      accent: '#42d4f5',
      accentBright: '#6ee7ff',
      accentDim: '#2aa8c7',
      accentGlow: 'rgba(66, 212, 245, 0.1)',
      accentText: '#041820',
      pop: '#ff5252',
      popGlow: 'rgba(255, 82, 82, 0.12)',
      bg: '#060a0e',
      surface: '#0c1218',
      surfaceRaised: '#121c24',
      surfaceHover: '#1a2834',
      text: '#dce8f0',
      textSecondary: '#6e8fa6',
      textMuted: '#324858',
      border: 'rgba(66, 212, 245, 0.06)',
      borderStrong: 'rgba(66, 212, 245, 0.15)',
    },
    ember: {
      label: 'Ember',
      desc: 'Burnt orange — warm, leather, classic football',
      accent: '#f0912a',
      accentBright: '#ffab4e',
      accentDim: '#c47420',
      accentGlow: 'rgba(240, 145, 42, 0.1)',
      accentText: '#1a0e00',
      pop: '#ff4466',
      popGlow: 'rgba(255, 68, 102, 0.12)',
      bg: '#0c0906',
      surface: '#161009',
      surfaceRaised: '#201a10',
      surfaceHover: '#2c2418',
      text: '#f0e6d8',
      textSecondary: '#a08c72',
      textMuted: '#5c4e3a',
      border: 'rgba(240, 145, 42, 0.06)',
      borderStrong: 'rgba(240, 145, 42, 0.15)',
    },
    volt: {
      label: 'Volt',
      desc: 'Hot magenta — loud, modern, defiant',
      accent: '#f540b0',
      accentBright: '#ff66cc',
      accentDim: '#c4308c',
      accentGlow: 'rgba(245, 64, 176, 0.1)',
      accentText: '#1a0012',
      pop: '#40f5a0',
      popGlow: 'rgba(64, 245, 160, 0.12)',
      bg: '#0a060a',
      surface: '#140e14',
      surfaceRaised: '#1e161e',
      surfaceHover: '#2c222c',
      text: '#f0e0ee',
      textSecondary: '#9e7898',
      textMuted: '#5a3e56',
      border: 'rgba(245, 64, 176, 0.06)',
      borderStrong: 'rgba(245, 64, 176, 0.15)',
    },
    bone: {
      label: 'Bone',
      desc: 'Pale gold on void — premium, restrained, heavy',
      accent: '#d4b870',
      accentBright: '#e8d08c',
      accentDim: '#b09850',
      accentGlow: 'rgba(212, 184, 112, 0.08)',
      accentText: '#14120a',
      pop: '#e85040',
      popGlow: 'rgba(232, 80, 64, 0.12)',
      bg: '#08080a',
      surface: '#101014',
      surfaceRaised: '#18181e',
      surfaceHover: '#222228',
      text: '#e8e4dc',
      textSecondary: '#8a867e',
      textMuted: '#4a4842',
      border: 'rgba(212, 184, 112, 0.06)',
      borderStrong: 'rgba(212, 184, 112, 0.12)',
    },
    bruise: {
      label: 'Bruise',
      desc: 'Deep violet — moody, nocturnal, velvet',
      accent: '#9d6aff',
      accentBright: '#b88aff',
      accentDim: '#7c4edb',
      accentGlow: 'rgba(157, 106, 255, 0.1)',
      accentText: '#0e0820',
      pop: '#ff6b4a',
      popGlow: 'rgba(255, 107, 74, 0.12)',
      bg: '#08060e',
      surface: '#0f0c18',
      surfaceRaised: '#161222',
      surfaceHover: '#201a30',
      text: '#e4dff0',
      textSecondary: '#8878a8',
      textMuted: '#483c60',
      border: 'rgba(157, 106, 255, 0.06)',
      borderStrong: 'rgba(157, 106, 255, 0.14)',
    },
    moss: {
      label: 'Moss',
      desc: 'Muted olive — earthy, military, rugged',
      accent: '#8aad5a',
      accentBright: '#a4c874',
      accentDim: '#6e8c44',
      accentGlow: 'rgba(138, 173, 90, 0.08)',
      accentText: '#0a1004',
      pop: '#e06050',
      popGlow: 'rgba(224, 96, 80, 0.12)',
      bg: '#080a06',
      surface: '#10140c',
      surfaceRaised: '#181e12',
      surfaceHover: '#22281a',
      text: '#dce2d4',
      textSecondary: '#7e8a70',
      textMuted: '#444e38',
      border: 'rgba(138, 173, 90, 0.06)',
      borderStrong: 'rgba(138, 173, 90, 0.12)',
    },
    siren: {
      label: 'Siren',
      desc: 'Cherry red — urgent, classic, alarm',
      accent: '#f03848',
      accentBright: '#ff5c68',
      accentDim: '#c42c38',
      accentGlow: 'rgba(240, 56, 72, 0.1)',
      accentText: '#1a0408',
      pop: '#38c8f0',
      popGlow: 'rgba(56, 200, 240, 0.12)',
      bg: '#0a0608',
      surface: '#140c10',
      surfaceRaised: '#1e1218',
      surfaceHover: '#2c1c22',
      text: '#f0dce0',
      textSecondary: '#a0727e',
      textMuted: '#5c3842',
      border: 'rgba(240, 56, 72, 0.06)',
      borderStrong: 'rgba(240, 56, 72, 0.14)',
    },
    chalk: {
      label: 'Chalk',
      desc: 'White on black — stark, zero compromise',
      accent: '#ffffff',
      accentBright: '#ffffff',
      accentDim: '#cccccc',
      accentGlow: 'rgba(255, 255, 255, 0.06)',
      accentText: '#000000',
      pop: '#ff3333',
      popGlow: 'rgba(255, 51, 51, 0.12)',
      bg: '#000000',
      surface: '#0a0a0a',
      surfaceRaised: '#141414',
      surfaceHover: '#1e1e1e',
      text: '#e8e8e8',
      textSecondary: '#888888',
      textMuted: '#444444',
      border: 'rgba(255, 255, 255, 0.06)',
      borderStrong: 'rgba(255, 255, 255, 0.12)',
    },
    copper: {
      label: 'Copper',
      desc: 'Oxidized metal — industrial, weathered, raw',
      accent: '#d4836a',
      accentBright: '#e89e84',
      accentDim: '#b06850',
      accentGlow: 'rgba(212, 131, 106, 0.08)',
      accentText: '#140a06',
      pop: '#58b8a0',
      popGlow: 'rgba(88, 184, 160, 0.12)',
      bg: '#0a0806',
      surface: '#12100c',
      surfaceRaised: '#1c1814',
      surfaceHover: '#28221c',
      text: '#e8e0d8',
      textSecondary: '#968478',
      textMuted: '#524840',
      border: 'rgba(212, 131, 106, 0.06)',
      borderStrong: 'rgba(212, 131, 106, 0.12)',
    },
    neon: {
      label: 'Neon',
      desc: 'Electric green — arcade, scoreboard, toxic',
      accent: '#39ff14',
      accentBright: '#66ff44',
      accentDim: '#2cc410',
      accentGlow: 'rgba(57, 255, 20, 0.08)',
      accentText: '#021a00',
      pop: '#ff2060',
      popGlow: 'rgba(255, 32, 96, 0.12)',
      bg: '#020804',
      surface: '#081008',
      surfaceRaised: '#0e180e',
      surfaceHover: '#162216',
      text: '#d4f0d0',
      textSecondary: '#6a9a64',
      textMuted: '#345830',
      border: 'rgba(57, 255, 20, 0.06)',
      borderStrong: 'rgba(57, 255, 20, 0.12)',
    },
    slate: {
      label: 'Slate',
      desc: 'Cool grey — neutral, architectural, concrete',
      accent: '#7ca0c4',
      accentBright: '#98badc',
      accentDim: '#5e82a4',
      accentGlow: 'rgba(124, 160, 196, 0.08)',
      accentText: '#060c14',
      pop: '#e8704a',
      popGlow: 'rgba(232, 112, 74, 0.12)',
      bg: '#08090c',
      surface: '#0e1014',
      surfaceRaised: '#16181e',
      surfaceHover: '#1e2228',
      text: '#d8dce4',
      textSecondary: '#788494',
      textMuted: '#3e4450',
      border: 'rgba(124, 160, 196, 0.06)',
      borderStrong: 'rgba(124, 160, 196, 0.12)',
    },
    hazard: {
      label: 'Hazard',
      desc: 'Safety yellow — high-vis, construction, caution',
      accent: '#ffe030',
      accentBright: '#ffea60',
      accentDim: '#ccb420',
      accentGlow: 'rgba(255, 224, 48, 0.08)',
      accentText: '#1a1800',
      pop: '#ff3838',
      popGlow: 'rgba(255, 56, 56, 0.12)',
      bg: '#0a0a04',
      surface: '#121208',
      surfaceRaised: '#1a1a0e',
      surfaceHover: '#242416',
      text: '#f0ecd4',
      textSecondary: '#9a9468',
      textMuted: '#565230',
      border: 'rgba(255, 224, 48, 0.05)',
      borderStrong: 'rgba(255, 224, 48, 0.12)',
    },
  };

  _applyTheme(key) {
    this.activeTheme = key;
    const t = DesignGuide.THEMES[key];
    const root = document.documentElement;
    root.style.setProperty('--color-accent', t.accent);
    root.style.setProperty('--color-accent-bright', t.accentBright);
    root.style.setProperty('--color-accent-dim', t.accentDim);
    root.style.setProperty('--color-accent-glow', t.accentGlow);
    root.style.setProperty('--color-accent-text', t.accentText);
    root.style.setProperty('--color-pop', t.pop);
    root.style.setProperty('--color-pop-glow', t.popGlow);
    root.style.setProperty('--color-bg', t.bg);
    root.style.setProperty('--color-surface', t.surface);
    root.style.setProperty('--color-surface-raised', t.surfaceRaised);
    root.style.setProperty('--color-surface-hover', t.surfaceHover);
    root.style.setProperty('--color-text', t.text);
    root.style.setProperty('--color-text-secondary', t.textSecondary);
    root.style.setProperty('--color-text-muted', t.textMuted);
    root.style.setProperty('--color-border', t.border);
    root.style.setProperty('--color-border-strong', t.borderStrong);
    root.style.setProperty('--shadow-glow', `0 0 30px ${t.accentGlow}`);
    root.style.setProperty('--shadow-glow-pop', `0 0 20px ${t.popGlow}`);
    document.body.style.background = t.bg;
  }

  firstUpdated() {
    this._applyTheme(this.activeTheme);
  }


  static styles = css`
    :host {
      display: block;
      font-family: var(--font-body);
      color: var(--color-text);
      background: var(--color-bg);
      min-height: 100vh;
    }

    /* ── Theme Picker ── */
    .theme-bar {
      position: sticky;
      top: 0;
      z-index: 200;
      background: #0a0a0c;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: var(--space-4) var(--space-6);
    }

    .theme-bar-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
    }

    .theme-option {
      background: #111114;
      border: 2px solid rgba(255,255,255,0.06);
      padding: 8px 10px;
      cursor: pointer;
      transition: all 120ms;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .theme-option:hover {
      background: #18181c;
    }

    .theme-option.active {
      border-color: var(--color-accent);
      background: #14141a;
    }

    .theme-swatch {
      width: 28px;
      height: 28px;
      flex-shrink: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 2px;
      overflow: hidden;
    }

    .sw-accent { border-radius: 0; }
    .sw-bg { border-radius: 0; }
    .sw-surface { border-radius: 0; }
    .sw-pop { border-radius: 0; }

    .theme-meta {
      min-width: 0;
    }

    .theme-label {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--text-sm);
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #ddd;
    }

    .theme-desc {
      font-size: 10px;
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .hero {
      padding: var(--space-16) var(--space-6) var(--space-10);
      max-width: 1200px;
      margin: 0 auto;
      border-bottom: 1px solid var(--color-border-strong);
    }

    .hero-title {
      font-family: var(--font-display);
      font-weight: 900;
      font-style: italic;
      font-size: var(--text-5xl);
      text-transform: uppercase;
      letter-spacing: 4px;
      color: var(--color-accent);
      line-height: 0.9;
    }

    .hero-sub {
      font-size: var(--text-lg);
      color: var(--color-text-muted);
      margin-top: var(--space-3);
      letter-spacing: 1px;
    }

    section {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-10) var(--space-6);
      border-bottom: 1px solid var(--color-border);
    }

    section:last-of-type { border-bottom: none; }

    h2 {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--text-sm);
      text-transform: uppercase;
      letter-spacing: 4px;
      color: var(--color-text-muted);
      margin: 0 0 var(--space-6);
      padding-bottom: var(--space-2);
      border-bottom: 1px solid var(--color-border);
    }

    .row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-4);
    }

    .col {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .label {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 600;
      margin-top: var(--space-4);
    }

    .label:first-child { margin-top: 0; }

    /* Typography */
    .type-display {
      font-family: var(--font-display);
      font-weight: 900;
      font-style: italic;
      text-transform: uppercase;
      letter-spacing: 3px;
    }

    .type-body { font-family: var(--font-body); }

    /* Swatches */
    .swatches {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 2px;
    }

    .swatch {
      height: 56px;
      display: flex;
      align-items: flex-end;
      padding: var(--space-1) var(--space-2);
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: var(--color-text-muted);
    }

    .swatch.light-text { color: rgba(0,0,0,0.5); }

    /* Input demos */
    .input-row {
      display: flex;
      gap: var(--space-3);
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .input-row wd-input { flex: 1; min-width: 200px; }

    .tags-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    /* Drafter demos */
    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 2px;
    }

    .team-stack {
      display: flex;
      flex-direction: column;
      gap: 1px;
      max-width: 520px;
    }

  `;

  render() {
    const themes = DesignGuide.THEMES;

    return html`
      <div class="theme-bar">
        <div class="theme-bar-inner">
          ${Object.entries(themes).map(([key, t]) => html`
            <div
              class="theme-option ${this.activeTheme === key ? 'active' : ''}"
              @click=${() => this._applyTheme(key)}
            >
              <div class="theme-swatch">
                <div class="sw-accent" style="background: ${t.accent}"></div>
                <div class="sw-pop" style="background: ${t.pop}"></div>
                <div class="sw-bg" style="background: ${t.bg}"></div>
                <div class="sw-surface" style="background: ${t.surfaceRaised}"></div>
              </div>
              <div class="theme-meta">
                <div class="theme-label">${t.label}</div>
                <div class="theme-desc">${t.desc}</div>
              </div>
            </div>
          `)}
        </div>
      </div>

      <div class="hero">
        <div class="hero-title">Design<br>System</div>
        <div class="hero-sub">Wins Draft / Component Reference</div>
      </div>

      <!-- ═══ Typography ═══ -->
      <section>
        <h2>Typography</h2>
        <div class="col" style="gap: var(--space-5)">
          <div>
            <div class="label">Display / 5XL</div>
            <div class="type-display" style="font-size: var(--text-5xl)">64 Wins</div>
          </div>
          <div>
            <div class="label">Display / 4XL</div>
            <div class="type-display" style="font-size: var(--text-4xl)">Season Leader</div>
          </div>
          <div>
            <div class="label">Display / 3XL</div>
            <div class="type-display" style="font-size: var(--text-3xl)">Draft Day</div>
          </div>
          <div>
            <div class="label">Display / 2XL</div>
            <div class="type-display" style="font-size: var(--text-2xl)">Head to Head</div>
          </div>
          <div>
            <div class="label">Body / LG</div>
            <div class="type-body" style="font-size: var(--text-lg)">Kansas City 27 — Buffalo 24. The Bills fall in overtime on a cold January night.</div>
          </div>
          <div>
            <div class="label">Body / Base</div>
            <div class="type-body">Regular weight body text for general content and descriptions.</div>
          </div>
          <div>
            <div class="label">Body / SM Secondary</div>
            <div class="type-body" style="font-size: var(--text-sm); color: var(--color-text-secondary)">Secondary text for captions and metadata</div>
          </div>
          <div>
            <div class="label">Body / XS Muted</div>
            <div class="type-body" style="font-size: var(--text-xs); color: var(--color-text-muted)">Muted labels, fine print, and timestamps</div>
          </div>
        </div>
      </section>

      <!-- ═══ Colors ═══ -->
      <section>
        <h2>Colors</h2>
        <div class="swatches">
          <div class="swatch" style="background: var(--color-bg)">bg</div>
          <div class="swatch" style="background: var(--color-surface)">surface</div>
          <div class="swatch" style="background: var(--color-surface-raised)">raised</div>
          <div class="swatch" style="background: var(--color-surface-hover)">hover</div>
          <div class="swatch light-text" style="background: var(--color-accent)">accent</div>
          <div class="swatch light-text" style="background: var(--color-accent-bright)">bright</div>
          <div class="swatch light-text" style="background: var(--color-accent-dim)">dim</div>
          <div class="swatch" style="background: var(--color-pop); color: white">pop</div>
          <div class="swatch light-text" style="background: var(--color-rank-1)">1st</div>
          <div class="swatch light-text" style="background: var(--color-rank-2)">2nd</div>
          <div class="swatch light-text" style="background: var(--color-rank-3)">3rd</div>
        </div>
      </section>

      <!-- ═══ Buttons ═══ -->
      <section>
        <h2>Buttons</h2>
        <div class="col" style="gap: var(--space-6)">
          <div>
            <div class="label">Primary</div>
            <div class="row">
              <wd-button size="sm">Small</wd-button>
              <wd-button size="md">Medium</wd-button>
              <wd-button size="lg">Large</wd-button>
              <wd-button disabled>Disabled</wd-button>
            </div>
          </div>
          <div>
            <div class="label">Secondary</div>
            <div class="row">
              <wd-button variant="secondary" size="sm">Small</wd-button>
              <wd-button variant="secondary">Medium</wd-button>
              <wd-button variant="secondary" size="lg">Large</wd-button>
              <wd-button variant="secondary" disabled>Disabled</wd-button>
            </div>
          </div>
          <div>
            <div class="label">Ghost</div>
            <div class="row">
              <wd-button variant="ghost" size="sm">Small</wd-button>
              <wd-button variant="ghost">Medium</wd-button>
              <wd-button variant="ghost" size="lg">Large</wd-button>
              <wd-button variant="ghost" disabled>Disabled</wd-button>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ Badges ═══ -->
      <section>
        <h2>Badges</h2>
        <div class="row">
          <wd-badge variant="rank-1">1st</wd-badge>
          <wd-badge variant="rank-2">2nd</wd-badge>
          <wd-badge variant="rank-3">3rd</wd-badge>
          <wd-badge variant="live" pulse>LIVE</wd-badge>
          <wd-badge variant="h2h">vs Cody</wd-badge>
          <wd-badge variant="bye">Bye Week</wd-badge>
          <wd-badge variant="record">10-4</wd-badge>
        </div>
      </section>

      <!-- ═══ Inputs & Controls ═══ -->
      <section>
        <h2>Inputs & Controls</h2>
        <div class="col" style="gap: var(--space-6)">
          <div>
            <div class="label">Text Input + Button</div>
            <div class="input-row">
              <wd-input placeholder="Enter player name"></wd-input>
              <wd-button>Add Player</wd-button>
            </div>
          </div>
          <div>
            <div class="label">Select Dropdown</div>
            <div class="row">
              <wd-select
                .options=${[
                  { value: '2025', label: '2025' },
                  { value: '2024', label: '2024' },
                ]}
                value="2025"
              ></wd-select>
              <wd-select
                .options=${[
                  { value: 'wins-desc', label: 'Most Wins' },
                  { value: 'wins-asc', label: 'Least Wins' },
                  { value: 'name-asc', label: 'Name A-Z' },
                ]}
                value="wins-desc"
              ></wd-select>
            </div>
          </div>
          <div>
            <div class="label">Player Tags</div>
            <div class="tags-row">
              <wd-player-tag name="Ethan" active></wd-player-tag>
              <wd-player-tag name="Kayla"></wd-player-tag>
              <wd-player-tag name="Cody"></wd-player-tag>
              <wd-player-tag name="Micah" .removable=${false}></wd-player-tag>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ Win Bar ═══ -->
      <section>
        <h2>Win Bar</h2>
        <div class="col" style="gap: var(--space-4); max-width: 500px">
          <div>
            <div class="label">Leader (100%)</div>
            <wd-win-bar value="42" max="42"></wd-win-bar>
          </div>
          <div>
            <div class="label">75%</div>
            <wd-win-bar value="32" max="42"></wd-win-bar>
          </div>
          <div>
            <div class="label">50%</div>
            <wd-win-bar value="21" max="42"></wd-win-bar>
          </div>
          <div>
            <div class="label">25%</div>
            <wd-win-bar value="11" max="42"></wd-win-bar>
          </div>
        </div>
      </section>

      <!-- ═══ Team Cards ═══ -->
      <section>
        <h2>Team Cards</h2>
        <div class="team-stack">
          <div class="label">Scheduled Game</div>
          <wd-team-card
            name="Bills"
            abbreviation="BUF"
            logo="https://a.espncdn.com/i/teamlogos/nfl/500/buf.png"
            wins="10"
            record="10-4"
            color="00338D"
            alternate-color="C60C30"
            game-status="scheduled"
            game-info="BUF @ KC — Sun Dec 15, 4:25 PM"
          ></wd-team-card>

          <div class="label">Live Game</div>
          <wd-team-card
            name="Chiefs"
            abbreviation="KC"
            logo="https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"
            wins="13"
            record="13-1"
            color="E31837"
            alternate-color="FFB612"
            game-status="live"
            game-score="KC 21 — BUF 17"
          ></wd-team-card>

          <div class="label">Final Score</div>
          <wd-team-card
            name="Ravens"
            abbreviation="BAL"
            logo="https://a.espncdn.com/i/teamlogos/nfl/500/bal.png"
            wins="11"
            record="11-4"
            color="241773"
            alternate-color="9E7C0C"
            game-status="final"
            game-score="Final: BAL 31 — PIT 17"
          ></wd-team-card>

          <div class="label">Bye Week</div>
          <wd-team-card
            name="Packers"
            abbreviation="GB"
            logo="https://a.espncdn.com/i/teamlogos/nfl/500/gb.png"
            wins="9"
            record="9-5"
            color="203731"
            alternate-color="FFB612"
            game-status="bye"
          ></wd-team-card>

          <div class="label">Offseason (record only)</div>
          <wd-team-card
            name="Lions"
            abbreviation="DET"
            logo="https://a.espncdn.com/i/teamlogos/nfl/500/det.png"
            wins="15"
            record="15-2"
            color="0076B6"
            alternate-color="B0B7BC"
            game-status="offseason"
          ></wd-team-card>

          <div class="label">Head-to-Head</div>
          <wd-team-card
            name="Eagles"
            abbreviation="PHI"
            logo="https://a.espncdn.com/i/teamlogos/nfl/500/phi.png"
            wins="12"
            record="12-3"
            color="004C54"
            alternate-color="A5ACAF"
            game-status="scheduled"
            game-info="PHI vs WSH — Mon Dec 16, 8:15 PM"
            h2h-opponent="Ethan"
          ></wd-team-card>

          <div class="label">Compact (Leftovers)</div>
          <wd-team-card
            name="Panthers" abbreviation="CAR"
            logo="https://a.espncdn.com/i/teamlogos/nfl/500/car.png"
            wins="3" record="3-12" color="0085CA" alternate-color="101820"
            game-status="offseason" compact
          ></wd-team-card>
          <wd-team-card
            name="Titans" abbreviation="TEN"
            logo="https://a.espncdn.com/i/teamlogos/nfl/500/ten.png"
            wins="4" record="4-11" color="0C2340" alternate-color="4B92DB"
            game-status="offseason" compact
          ></wd-team-card>
        </div>
      </section>

      <!-- ═══ Drafter Cards ═══ -->
      <section>
        <h2>Drafter Cards</h2>
        <div class="demo-grid">
          <wd-drafter-card name="Cody" rank="1" total-wins="42" max-wins="42">
            <wd-team-card
              name="Ravens" abbreviation="BAL"
              logo="https://a.espncdn.com/i/teamlogos/nfl/500/bal.png"
              wins="11" record="11-4" color="241773"
              game-status="final" game-score="Final: BAL 31 — PIT 17"
            ></wd-team-card>
            <wd-team-card
              name="Chiefs" abbreviation="KC"
              logo="https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"
              wins="13" record="13-1" color="E31837"
              game-status="live" game-score="KC 21 — BUF 17"
              h2h-opponent="Ethan"
            ></wd-team-card>
            <wd-team-card
              name="Packers" abbreviation="GB"
              logo="https://a.espncdn.com/i/teamlogos/nfl/500/gb.png"
              wins="9" record="9-5" color="203731"
              game-status="bye"
            ></wd-team-card>
            <wd-team-card
              name="Bengals" abbreviation="CIN"
              logo="https://a.espncdn.com/i/teamlogos/nfl/500/cin.png"
              wins="6" record="6-9" color="FB4F14"
              game-status="scheduled" game-info="CIN @ CLE — Sat Dec 14, 1:00 PM"
            ></wd-team-card>
            <wd-team-card
              name="Rams" abbreviation="LAR"
              logo="https://a.espncdn.com/i/teamlogos/nfl/500/lar.png"
              wins="3" record="3-11" color="003594"
              game-status="scheduled" game-info="LAR vs SF — Sun Dec 15, 4:05 PM"
            ></wd-team-card>
          </wd-drafter-card>

          <wd-drafter-card name="Ethan" rank="2" total-wins="38" max-wins="42">
            <wd-team-card
              name="Bills" abbreviation="BUF"
              logo="https://a.espncdn.com/i/teamlogos/nfl/500/buf.png"
              wins="11" record="11-3" color="00338D"
              game-status="live" game-score="KC 21 — BUF 17"
              h2h-opponent="Cody"
            ></wd-team-card>
            <wd-team-card
              name="Commanders" abbreviation="WSH"
              logo="https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png"
              wins="9" record="9-5" color="5A1414"
              game-status="scheduled" game-info="WSH @ PHI — Mon Dec 16, 8:15 PM"
            ></wd-team-card>
            <wd-team-card
              name="Lions" abbreviation="DET"
              logo="https://a.espncdn.com/i/teamlogos/nfl/500/det.png"
              wins="12" record="12-2" color="0076B6"
              game-status="final" game-score="Final: DET 34 — GB 31"
            ></wd-team-card>
            <wd-team-card
              name="Buccaneers" abbreviation="TB"
              logo="https://a.espncdn.com/i/teamlogos/nfl/500/tb.png"
              wins="4" record="4-10" color="D50A0A"
              game-status="bye"
            ></wd-team-card>
            <wd-team-card
              name="Broncos" abbreviation="DEN"
              logo="https://a.espncdn.com/i/teamlogos/nfl/500/den.png"
              wins="2" record="2-12" color="FB4F14"
              game-status="scheduled" game-info="DEN vs IND — Sun Dec 15, 4:25 PM"
            ></wd-team-card>
          </wd-drafter-card>
        </div>
      </section>

      <!-- ═══ Leftovers ═══ -->
      <section>
        <h2>Leftovers</h2>
        <div style="max-width: 520px">
          <wd-drafter-card name="Leftovers" total-wins="18" max-wins="42" is-leftovers>
            <wd-team-card
              name="Vikings" abbreviation="MIN"
              logo="https://a.espncdn.com/i/teamlogos/nfl/500/min.png"
              wins="7" record="7-7" color="4F2683"
              game-status="offseason" compact
            ></wd-team-card>
            <wd-team-card
              name="Bears" abbreviation="CHI"
              logo="https://a.espncdn.com/i/teamlogos/nfl/500/chi.png"
              wins="4" record="4-10" color="0B162A"
              game-status="offseason" compact
            ></wd-team-card>
            <wd-team-card
              name="Giants" abbreviation="NYG"
              logo="https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png"
              wins="3" record="3-11" color="0B2265"
              game-status="offseason" compact
            ></wd-team-card>
          </wd-drafter-card>
        </div>
      </section>

      <!-- ═══ Header ═══ -->
      <section>
        <h2>Header</h2>
        <div class="col" style="gap: var(--space-6)">
          <div>
            <div class="label">Active Season</div>
            <wd-header year="2025" week="15" show-week></wd-header>
          </div>
          <div>
            <div class="label">Past Season</div>
            <wd-header year="2024"></wd-header>
          </div>
        </div>
      </section>

      <!-- ═══ Footer ═══ -->
      <section>
        <h2>Footer</h2>
        <wd-footer .years=${[2025, 2024]} selected-year="2025"></wd-footer>
      </section>

      <!-- ═══ Loading ═══ -->
      <section>
        <h2>Loading</h2>
        <div style="height: 280px; background: var(--color-surface); border: 1px solid var(--color-border); overflow: hidden;">
          <wd-loading></wd-loading>
        </div>
      </section>

      <!-- ═══ Card ═══ -->
      <section>
        <h2>Card</h2>
        <div class="row" style="align-items: stretch;">
          <wd-card>
            <div style="padding: var(--space-2); font-size: var(--text-sm)">Default card</div>
          </wd-card>
          <wd-card elevated>
            <div style="padding: var(--space-2); font-size: var(--text-sm)">Elevated card</div>
          </wd-card>
        </div>
      </section>
    `;
  }
}

customElements.define('design-guide', DesignGuide);
