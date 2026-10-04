import { Palette } from '@/types';

export const CURATED_PALETTES: Palette[] = [
  // --- Dark Mode Palettes ---
  {
    id: 'tokyo_night',
    name: 'Tokyo Night',
    mode: 'dark',
    background: '#1a1b26',
    colors: ['#7aa2f7', '#bb9af7', '#7dcfff', '#f7768e', '#9ece6a'],
  },
  {
    id: 'dracula_neon',
    name: 'Dracula Neon',
    mode: 'dark',
    background: '#282a36',
    colors: ['#ff79c6', '#bd93f9', '#50fa7b', '#8be9fd', '#ffb86c'],
  },
  {
    id: 'gruvbox_dark',
    name: 'Gruvbox Dark',
    mode: 'dark',
    background: '#282828',
    colors: ['#fe8019', '#fabd2f', '#8ec07c', '#fb4934', '#d3869b'],
  },
  {
    id: 'nord_dark',
    name: 'Nord Dark',
    mode: 'dark',
    background: '#2e3440',
    colors: ['#88c0d0', '#81a1c1', '#5e81ac', '#bf616a', '#d08770'],
  },
  {
    id: 'cyberpunk_dark',
    name: 'Neon Cyber',
    mode: 'dark',
    background: '#0d0e15',
    colors: ['#ff007f', '#00f0ff', '#7928ca', '#ff0080', '#00dfa2'],
  },
  {
    id: 'solarized_dark',
    name: 'Solarized Cyan',
    mode: 'dark',
    background: '#002b36',
    colors: ['#268bd2', '#2aa198', '#859900', '#b58900', '#d33682'],
  },
  {
    id: 'deep_space',
    name: 'Deep Space',
    mode: 'dark',
    background: '#0a0a12',
    colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'],
  },
  {
    id: 'monochrome_dark',
    name: 'Obsidian Minimal',
    mode: 'dark',
    background: '#121212',
    colors: ['#ffffff', '#a1a1aa', '#71717a', '#52525b', '#3f3f46'],
  },

  // --- Light Mode Palettes ---
  {
    id: 'nord_light',
    name: 'Nordic Snow',
    mode: 'light',
    background: '#eceff4',
    colors: ['#5e81ac', '#81a1c1', '#88c0d0', '#bf616a', '#d08770'],
  },
  {
    id: 'pastel_sunset',
    name: 'Pastel Sunset',
    mode: 'light',
    background: '#fdfbf7',
    colors: ['#ffb703', '#fb8500', '#ffb5a7', '#fcd5ce', '#f8edeb'],
  },
  {
    id: 'sahara_gold',
    name: 'Sahara Gold',
    mode: 'light',
    background: '#fefae0',
    colors: ['#dda15e', '#bc6c25', '#283618', '#606c38', '#f4a261'],
  },
  {
    id: 'matcha_latte',
    name: 'Matcha Forest',
    mode: 'light',
    background: '#f4f6f0',
    colors: ['#588157', '#3a5a40', '#a3b18a', '#dad7cd', '#344e41'],
  },
  {
    id: 'rose_blossom',
    name: 'Rose Gold',
    mode: 'light',
    background: '#fff5f5',
    colors: ['#e5989b', '#b5838d', '#6b705c', '#cb997e', '#ddbea9'],
  },
];

export const DEFAULT_PALETTE = CURATED_PALETTES[0];

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generateRandomCustomPalette(mode?: 'light' | 'dark'): Palette {
  const isDark = mode ? mode === 'dark' : Math.random() > 0.3;
  const bgHue = Math.floor(Math.random() * 360);
  const bgSat = isDark ? Math.floor(Math.random() * 30) : Math.floor(Math.random() * 20);
  const bgLight = isDark ? Math.floor(5 + Math.random() * 12) : Math.floor(90 + Math.random() * 8);

  const background = hslToHex(bgHue, bgSat, bgLight);

  const baseHue = Math.floor(Math.random() * 360);
  const colors: string[] = [];

  for (let i = 0; i < 5; i++) {
    const h = (baseHue + i * 65 + Math.floor(Math.random() * 40)) % 360;
    const s = Math.floor(65 + Math.random() * 30);
    const l = isDark ? Math.floor(45 + Math.random() * 35) : Math.floor(30 + Math.random() * 35);
    colors.push(hslToHex(h, s, l));
  }

  return {
    id: `random_${Date.now()}`,
    name: 'Randomized Colors',
    mode: isDark ? 'dark' : 'light',
    background,
    colors,
  };
}

export function getRandomPalette(mode?: 'light' | 'dark', excludeId?: string): Palette {
  let filtered = mode ? CURATED_PALETTES.filter((p) => p.mode === mode) : CURATED_PALETTES;
  if (excludeId) {
    const nonCurrent = filtered.filter((p) => p.id !== excludeId);
    if (nonCurrent.length > 0) filtered = nonCurrent;
  }
  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index];
}
