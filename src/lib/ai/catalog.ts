import { PATTERNS } from '@/lib/engine';
import { PARAM_RANGES } from '@/lib/engine/params';

/**
 * Mood words that describe what each pattern evokes.
 * Used to steer the model and by the offline keyword fallback.
 * Patterns missing here still work: the model falls back to the description.
 */
export const PATTERN_MOODS: Record<string, string[]> = {
  waves: ['ocean', 'sea', 'water', 'wave', 'beach', 'tide', 'river', 'lake', 'calm', 'flow'],
  gradients: ['gradient', 'soft', 'simple', 'clean', 'sky', 'dawn', 'morning', 'fade', 'smooth', 'plain'],
  meshGradients: ['glow', 'aura', 'dreamy', 'blur', 'mesh', 'blob', 'pastel', 'haze', 'warm light'],
  arcs: ['mountain', 'hill', 'horizon', 'sunset', 'sunrise', 'landscape', 'dune', 'desert', 'valley'],
  topography: ['map', 'terrain', 'contour', 'topographic', 'elevation', 'hiking', 'forest', 'nature'],
  geometric: ['shape', 'geometric', 'bauhaus', 'polygon', 'architecture', 'modern', 'balance', 'abstract', 'structure', 'house', 'building'],
  silkFlow: ['silk', 'fluid', 'ribbon', 'wind', 'smoke', 'flowing', 'fabric', 'elegant'],
  noiseFields: ['space', 'galaxy', 'nebula', 'cosmic', 'cloud', 'plasma', 'storm', 'universe', 'stars'],
  voronoi: ['crystal', 'glass', 'stained', 'cell', 'mosaic', 'ice', 'shattered', 'gem'],
  stripes: ['line', 'lines', 'stripe', 'code', 'coding', 'rain', 'speed', 'retro', 'minimal lines'],
  dotGrid: ['dot', 'dots', 'grid', 'pixel', 'matrix', 'halftone', 'tech', 'digital'],
  layeredCircles: ['planet', 'moon', 'orbit', 'ring', 'circle', 'sun', 'eclipse', 'celestial'],
  aurora: ['aurora', 'northern lights', 'curtain', 'polar', 'arctic', 'night sky', 'ethereal'],
  kaleidoscope: ['flower', 'mandala', 'kaleidoscope', 'symmetry', 'bloom', 'petal', 'snowflake'],
  origamiPeaks: ['origami', 'mountain', 'peaks', 'alps', 'ridge', 'low poly mountain', 'faceted terrain', 'pyramid'],
  flowField: ['flow field', 'vector', 'fluid', 'particle', 'magnetic', 'current', 'energy', 'vortex', 'stream'],
  glassmorphism: ['glass', 'prism', 'frosted', 'mac', 'apple', 'translucent', 'ambient', 'panel', 'sleek'],
  lightRays: ['light', 'rays', 'beam', 'sunbeam', 'volumetric', 'mist', 'haze', 'atmosphere', 'sunlight'],
};

/**
 * Model-facing catalog, built from the live pattern registry so new
 * patterns become available to the AI automatically.
 */
export function buildPatternCatalog(): string {
  return PATTERNS.map((p) => {
    const moods = PATTERN_MOODS[p.id];
    const moodText = moods ? ` Evokes: ${moods.join(', ')}.` : '';
    return `- ${p.id} (${p.name}, ${p.category}): ${p.description}.${moodText}`;
  }).join('\n');
}

export function buildParamGuide(): string {
  const r = PARAM_RANGES;
  return [
    `- scale ${r.scale.min}–${r.scale.max}: size of elements (low = small and many, high = big and bold)`,
    `- density ${r.density.min}–${r.density.max} (integer): number of elements/lines (minimal ≈ 3–8, busy ≈ 20+)`,
    `- complexity ${r.complexity.min}–${r.complexity.max} (integer): detail level (minimal ≈ 1–3, intricate ≈ 7–10)`,
    `- noiseIntensity ${r.noiseIntensity.min}–${r.noiseIntensity.max}: film grain (clean ≈ 0–0.03, vintage/textured ≈ 0.1–0.25)`,
    `- rotation ${r.rotation.min}–${r.rotation.max} (multiple of ${r.rotation.step}): angle in degrees`,
  ].join('\n');
}

export const PATTERN_IDS: string[] = PATTERNS.map((p) => p.id);
