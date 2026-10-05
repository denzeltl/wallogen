import { AiWallpaperConfig, Palette } from '@/types';
import { PATTERN_IDS, PATTERN_MOODS } from './catalog';
import { validateAiConfig } from './validate';
import { CURATED_PALETTES } from '@/lib/palettes';

/**
 * Offline "close match" used when the AI is unavailable or out of quota.
 * Pure keyword matching against the prompt: no network, deterministic per prompt.
 */

const PALETTE_KEYWORDS: Record<string, string[]> = {
  nord_dark: ['ocean', 'sea', 'water', 'blue', 'cold', 'dusk', 'calm', 'lake', 'rain'],
  solarized_dark: ['teal', 'cyan', 'turquoise', 'lagoon', 'deep sea'],
  deep_space: ['northern lights', 'aurora', 'space', 'galaxy', 'nebula', 'cosmic', 'night', 'stars', 'midnight', 'universe', 'moon'],
  cyberpunk_dark: ['neon', 'cyber', 'cyberpunk', 'synthwave', 'vaporwave', 'electric', 'futuristic', 'tech'],
  dracula_neon: ['purple', 'violet', 'magenta', 'dracula', 'mystic', 'gothic'],
  tokyo_night: ['tokyo', 'city', 'coding', 'code', 'programmer', 'developer', 'dark mode'],
  gruvbox_dark: ['retro', 'autumn', 'fall', 'warm', 'vintage', 'cozy', 'coffee', 'brown'],
  monochrome_dark: ['black', 'monochrome', 'mono', 'grayscale', 'noir', 'minimal dark', 'obsidian'],
  nord_light: ['snow', 'winter', 'ice', 'frost', 'white', 'nordic', 'arctic', 'clean'],
  pastel_sunset: ['sunset', 'sunrise', 'pastel', 'dreamy', 'peach', 'soft', 'orange'],
  sahara_gold: ['desert', 'sand', 'gold', 'dune', 'beige', 'sahara', 'earth', 'summer'],
  matcha_latte: ['forest', 'green', 'nature', 'leaf', 'matcha', 'jungle', 'spring', 'moss', 'tree'],
  rose_blossom: ['rose', 'pink', 'love', 'blossom', 'sakura', 'cherry', 'romantic', 'flower'],
};

const DARK_WORDS = ['dark', 'night', 'black', 'midnight', 'moody', 'shadow'];
const LIGHT_WORDS = ['light', 'bright', 'white', 'airy', 'day', 'pale'];
const CALM_WORDS = ['minimal', 'minimalist', 'calm', 'simple', 'clean', 'quiet', 'zen', 'subtle', 'peaceful'];
const BUSY_WORDS = ['busy', 'intricate', 'complex', 'detailed', 'chaotic', 'dense', 'wild', 'energetic'];
const GRAIN_WORDS = ['grain', 'grainy', 'film', 'vintage', 'retro', 'texture', 'textured', 'paper'];

function hashString(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Prefix match ("snow" finds "snowy") unless `exact`, so "light" doesn't match "lights". */
function includesWord(text: string, word: string, exact = false): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}${exact ? '\\b' : ''}`, 'i').test(text);
}

function bestMatch(text: string, table: Record<string, string[]>): { id: string; hits: string[] } | null {
  let best: { id: string; hits: string[] } | null = null;
  let bestScore = 0;
  for (const [id, words] of Object.entries(table)) {
    const hits = words.filter((w) => includesWord(text, w));
    // Longer phrases are more specific: "northern lights" beats "mountain"
    const score = hits.reduce((sum, w) => sum + w.length, 0);
    if (score > bestScore) {
      best = { id, hits };
      bestScore = score;
    }
  }
  return best;
}

// Built from a string so the ES2017 TS target accepts the Unicode property escapes
const NON_WORD_RE = new RegExp("[^\\p{L}\\p{N}\\s'-]", 'gu');

function toTitle(prompt: string): string {
  const words = prompt.replace(NON_WORD_RE, ' ').trim().split(/\s+/).slice(0, 4);
  const title = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  return title || 'Close Match';
}

export function fallbackConfigFromPrompt(prompt: string): AiWallpaperConfig {
  const text = prompt.toLowerCase();
  const hash = hashString(text);

  const patternMatch = bestMatch(text, PATTERN_MOODS);
  const patternId = patternMatch?.id ?? PATTERN_IDS[hash % PATTERN_IDS.length];

  const wantsDark = DARK_WORDS.some((w) => includesWord(text, w, true));
  const wantsLight = LIGHT_WORDS.some((w) => includesWord(text, w, true));
  const paletteMatch = bestMatch(text, PALETTE_KEYWORDS);

  let palette: Palette | undefined = paletteMatch ? CURATED_PALETTES.find((p) => p.id === paletteMatch.id) : undefined;
  const wantedMode = wantsDark && !wantsLight ? 'dark' : wantsLight && !wantsDark ? 'light' : null;
  if (!palette || (wantedMode && palette.mode !== wantedMode)) {
    const pool = CURATED_PALETTES.filter((p) => !wantedMode || p.mode === wantedMode);
    palette = pool[hash % pool.length];
  }

  const calm = CALM_WORDS.some((w) => includesWord(text, w));
  const busy = BUSY_WORDS.some((w) => includesWord(text, w));
  const grainy = GRAIN_WORDS.some((w) => includesWord(text, w));

  const matched = Array.from(new Set([...(patternMatch?.hits ?? []), ...(paletteMatch?.hits ?? [])])).slice(0, 3);
  const rationale = matched.length
    ? `Matched “${matched.join('”, “')}” from your description.`
    : 'A gentle interpretation of your description.';

  return validateAiConfig({
    title: toTitle(prompt),
    rationale,
    patternId,
    palette: { mode: palette.mode, background: palette.background, colors: palette.colors },
    params: {
      scale: busy ? 0.8 : calm ? 1.4 : 1.0,
      density: busy ? 24 : calm ? 5 : 10,
      complexity: busy ? 8 : calm ? 2 : 4,
      noiseIntensity: grainy ? 0.15 : calm ? 0.03 : 0.06,
      rotation: (hash % 24) * 15,
    },
  });
}
