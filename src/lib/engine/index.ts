import { WallpaperPattern, Palette, PatternParams } from '@/types';
import { wavesPattern } from './patterns/waves';
import { gradientsPattern } from './patterns/gradients';
import { meshGradientsPattern } from './patterns/meshGradients';
import { arcsPattern } from './patterns/arcs';
import { topographyPattern } from './patterns/topography';
import { geometricPattern } from './patterns/geometric';
import { silkFlowPattern } from './patterns/silkFlow';
import { noiseFieldsPattern } from './patterns/noiseFields';
import { voronoiPattern } from './patterns/voronoi';
import { stripesPattern } from './patterns/stripes';
import { dotGridPattern } from './patterns/dotGrid';
import { layeredCirclesPattern } from './patterns/layeredCircles';
import { auroraPattern } from './patterns/aurora';
import { kaleidoscopePattern } from './patterns/kaleidoscope';

/**
 * Array of all registered wallpaper pattern engines
 */
export const PATTERNS: WallpaperPattern[] = [
  wavesPattern,
  gradientsPattern,
  meshGradientsPattern,
  arcsPattern,
  topographyPattern,
  geometricPattern,
  silkFlowPattern,
  noiseFieldsPattern,
  voronoiPattern,
  stripesPattern,
  dotGridPattern,
  layeredCirclesPattern,
  auroraPattern,
  kaleidoscopePattern,
];

/**
 * Default selected pattern
 */
export const DEFAULT_PATTERN = PATTERNS[0];

/**
 * Retrieve pattern renderer by ID
 */
export function getPatternById(id: string): WallpaperPattern {
  return PATTERNS.find((p) => p.id === id) || DEFAULT_PATTERN;
}

/**
 * Main Wallpaper Engine Render Executor
 */
export function renderWallpaper(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  patternId: string,
  palette: Palette,
  params: PatternParams
) {
  const pattern = getPatternById(patternId);

  // Clear canvas before drawing
  ctx.clearRect(0, 0, width, height);

  // Execute pure pattern rendering function
  pattern.render(ctx, width, height, palette, params);
}
