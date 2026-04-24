const DARK = {
  slate: {
    label: 'Slate',
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
  neon: {
    label: 'Neon',
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
  bone: {
    label: 'Bone',
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
  volt: {
    label: 'Volt',
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
};

const LIGHT = {
  slate: {
    label: 'Slate',
    accent: '#3d6e8e',
    accentBright: '#2d5e7e',
    accentDim: '#5a8aaa',
    accentGlow: 'rgba(61, 110, 142, 0.06)',
    accentText: '#ffffff',
    pop: '#c4502a',
    popGlow: 'rgba(196, 80, 42, 0.08)',
    bg: '#eef1f4',
    surface: '#f5f7f9',
    surfaceRaised: '#ffffff',
    surfaceHover: '#e4e8ee',
    text: '#141c28',
    textSecondary: '#4a5668',
    textMuted: '#94a0ae',
    border: 'rgba(61, 110, 142, 0.1)',
    borderStrong: 'rgba(61, 110, 142, 0.18)',
  },
  neon: {
    label: 'Neon',
    accent: '#148a08',
    accentBright: '#0e7204',
    accentDim: '#2aaa1e',
    accentGlow: 'rgba(20, 138, 8, 0.06)',
    accentText: '#ffffff',
    pop: '#c01040',
    popGlow: 'rgba(192, 16, 64, 0.08)',
    bg: '#eef2ee',
    surface: '#f4f8f4',
    surfaceRaised: '#ffffff',
    surfaceHover: '#e0ece0',
    text: '#0c1a0a',
    textSecondary: '#3e5a3c',
    textMuted: '#8ea88a',
    border: 'rgba(20, 138, 8, 0.08)',
    borderStrong: 'rgba(20, 138, 8, 0.15)',
  },
  bone: {
    label: 'Bone',
    accent: '#8a7430',
    accentBright: '#746020',
    accentDim: '#a89448',
    accentGlow: 'rgba(138, 116, 48, 0.06)',
    accentText: '#ffffff',
    pop: '#b83020',
    popGlow: 'rgba(184, 48, 32, 0.08)',
    bg: '#f0eee8',
    surface: '#f6f4f0',
    surfaceRaised: '#ffffff',
    surfaceHover: '#e8e4dc',
    text: '#181610',
    textSecondary: '#5c5848',
    textMuted: '#a4a094',
    border: 'rgba(138, 116, 48, 0.08)',
    borderStrong: 'rgba(138, 116, 48, 0.15)',
  },
  volt: {
    label: 'Volt',
    accent: '#a81878',
    accentBright: '#901068',
    accentDim: '#c42890',
    accentGlow: 'rgba(168, 24, 120, 0.06)',
    accentText: '#ffffff',
    pop: '#18a868',
    popGlow: 'rgba(24, 168, 104, 0.08)',
    bg: '#f2eef2',
    surface: '#f8f4f8',
    surfaceRaised: '#ffffff',
    surfaceHover: '#eae2ea',
    text: '#18081a',
    textSecondary: '#644860',
    textMuted: '#aa94a6',
    border: 'rgba(168, 24, 120, 0.06)',
    borderStrong: 'rgba(168, 24, 120, 0.14)',
  },
};

export const THEMES = DARK;
export const THEMES_LIGHT = LIGHT;
export const THEME_KEYS = Object.keys(DARK);

export function applyTheme(key, mode) {
  const palette = mode === 'light' ? LIGHT : DARK;
  const t = palette[key];
  if (!t) return;
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
  localStorage.setItem('wd-theme', key);
  localStorage.setItem('wd-mode', mode);
}

export function loadSavedTheme() {
  const savedKey = localStorage.getItem('wd-theme') || 'slate';
  const savedMode = localStorage.getItem('wd-mode') || 'dark';
  const key = DARK[savedKey] ? savedKey : 'slate';
  applyTheme(key, savedMode);
  return { key, mode: savedMode };
}
