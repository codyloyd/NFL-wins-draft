import { describe, it, expect, beforeEach } from 'vitest';
import { THEMES, THEMES_LIGHT, THEME_KEYS, applyTheme, loadSavedTheme } from '../src/themes.js';

const mockStorage = new Map();
const mockStyleProps = new Map();

beforeEach(() => {
  mockStorage.clear();
  mockStyleProps.clear();

  globalThis.localStorage = {
    getItem: (k) => mockStorage.get(k) ?? null,
    setItem: (k, v) => mockStorage.set(k, v),
    removeItem: (k) => mockStorage.delete(k),
  };

  globalThis.document = {
    documentElement: {
      style: {
        setProperty: (k, v) => mockStyleProps.set(k, v),
      },
    },
    body: { style: {} },
  };
});

describe('THEME_KEYS', () => {
  it('has all four themes', () => {
    expect(THEME_KEYS).toContain('slate');
    expect(THEME_KEYS).toContain('neon');
    expect(THEME_KEYS).toContain('bone');
    expect(THEME_KEYS).toContain('volt');
    expect(THEME_KEYS.length).toBe(4);
  });
});

describe('THEMES / THEMES_LIGHT', () => {
  it('dark and light have the same keys', () => {
    expect(Object.keys(THEMES).sort()).toEqual(Object.keys(THEMES_LIGHT).sort());
  });

  it('each theme has required color properties', () => {
    for (const key of THEME_KEYS) {
      const dark = THEMES[key];
      const light = THEMES_LIGHT[key];
      for (const palette of [dark, light]) {
        expect(palette.accent).toBeDefined();
        expect(palette.bg).toBeDefined();
        expect(palette.surface).toBeDefined();
        expect(palette.text).toBeDefined();
      }
    }
  });
});

describe('applyTheme', () => {
  it('sets CSS variables on document root', () => {
    applyTheme('slate', 'dark');
    expect(mockStyleProps.get('--color-accent')).toBe(THEMES.slate.accent);
    expect(mockStyleProps.get('--color-bg')).toBe(THEMES.slate.bg);
    expect(mockStyleProps.get('--color-text')).toBe(THEMES.slate.text);
  });

  it('uses light palette when mode is light', () => {
    applyTheme('neon', 'light');
    expect(mockStyleProps.get('--color-accent')).toBe(THEMES_LIGHT.neon.accent);
    expect(mockStyleProps.get('--color-bg')).toBe(THEMES_LIGHT.neon.bg);
  });

  it('persists theme and mode to localStorage', () => {
    applyTheme('bone', 'dark');
    expect(mockStorage.get('wd-theme')).toBe('bone');
    expect(mockStorage.get('wd-mode')).toBe('dark');
  });

  it('no-op for invalid theme key', () => {
    applyTheme('nonexistent', 'dark');
    expect(mockStyleProps.size).toBe(0);
  });
});

describe('loadSavedTheme', () => {
  it('defaults to slate/dark with no localStorage', () => {
    const { key, mode } = loadSavedTheme();
    expect(key).toBe('slate');
    expect(mode).toBe('dark');
  });

  it('loads saved theme from localStorage', () => {
    mockStorage.set('wd-theme', 'volt');
    mockStorage.set('wd-mode', 'light');
    const { key, mode } = loadSavedTheme();
    expect(key).toBe('volt');
    expect(mode).toBe('light');
  });

  it('falls back to slate for invalid saved theme', () => {
    mockStorage.set('wd-theme', 'garbage');
    const { key } = loadSavedTheme();
    expect(key).toBe('slate');
  });

  it('applies theme to CSS variables', () => {
    mockStorage.set('wd-theme', 'neon');
    mockStorage.set('wd-mode', 'dark');
    loadSavedTheme();
    expect(mockStyleProps.get('--color-accent')).toBe(THEMES.neon.accent);
  });
});
