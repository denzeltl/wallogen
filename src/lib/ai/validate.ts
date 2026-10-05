import { AiWallpaperConfig, ColorMode } from '@/types';
import { PATTERN_IDS } from './catalog';
import { clampParam } from '@/lib/engine/params';
import { CURATED_PALETTES } from '@/lib/palettes';

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
const DEFAULT_PATTERN_ID = 'meshGradients';

function normalizeHex(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(HEX_RE);
  if (!match) return null;
  let hex = match[1].toLowerCase();
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  return `#${hex}`;
}

function cleanText(value: unknown, maxLength: number, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  // Strip control characters and markup-ish brackets; the UI renders text only
  const cleaned = value.replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim();
  return cleaned ? cleaned.slice(0, maxLength) : fallback;
}

function toNumber(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Turn untrusted model output into a config the engine can always render.
 * Never throws: anything missing or malformed is repaired with safe defaults.
 */
export function validateAiConfig(raw: unknown): AiWallpaperConfig {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const rawPalette = (obj.palette && typeof obj.palette === 'object' ? obj.palette : obj) as Record<string, unknown>;
  const rawParams = (obj.params && typeof obj.params === 'object' ? obj.params : obj) as Record<string, unknown>;

  const patternId =
    typeof obj.patternId === 'string' && PATTERN_IDS.includes(obj.patternId) ? obj.patternId : DEFAULT_PATTERN_ID;

  const mode: ColorMode = rawPalette.mode === 'light' ? 'light' : 'dark';
  const reference = CURATED_PALETTES.find((p) => p.mode === mode) ?? CURATED_PALETTES[0];

  const background = normalizeHex(rawPalette.background) ?? reference.background;
  const rawColors = Array.isArray(rawPalette.colors) ? rawPalette.colors : [];
  const colors = Array.from(new Set(rawColors.map(normalizeHex).filter((c): c is string => c !== null))).slice(0, 5);
  // Patterns expect several accent colours; top up from the reference palette
  for (const c of reference.colors) {
    if (colors.length >= 3) break;
    if (!colors.includes(c)) colors.push(c);
  }

  return {
    title: cleanText(obj.title, 48, 'AI Wallpaper'),
    rationale: cleanText(obj.rationale, 160, ''),
    patternId,
    palette: { mode, background, colors },
    params: {
      scale: clampParam('scale', toNumber(rawParams.scale, 1)),
      density: clampParam('density', Math.round(toNumber(rawParams.density, 8))),
      complexity: clampParam('complexity', Math.round(toNumber(rawParams.complexity, 4))),
      noiseIntensity: clampParam('noiseIntensity', toNumber(rawParams.noiseIntensity, 0.05)),
      rotation: clampParam('rotation', toNumber(rawParams.rotation, 0)),
    },
  };
}
