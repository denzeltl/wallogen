import { createPRNG } from './utils';

// Cache noise tiles by intensity & seed to avoid re-generating on every frame
const tileCache = new Map<string, HTMLCanvasElement>();

/**
 * Creates or retrieves a 256x256 monochrome noise pattern canvas tile
 */
function getNoiseTile(intensity: number, seed: number): HTMLCanvasElement {
  const cacheKey = `${Math.round(intensity * 100)}_${seed}`;
  if (tileCache.has(cacheKey)) {
    return tileCache.get(cacheKey)!;
  }

  const tileSize = 256;
  const canvas = document.createElement('canvas');
  canvas.width = tileSize;
  canvas.height = tileSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const imgData = ctx.createImageData(tileSize, tileSize);
  const data = imgData.data;
  const rng = createPRNG(seed + 9999);

  for (let i = 0; i < data.length; i += 4) {
    // Generate subtle white/black grain noise
    const noiseVal = Math.floor(rng() * 255);
    data[i] = noiseVal;     // R
    data[i + 1] = noiseVal; // G
    data[i + 2] = noiseVal; // B
    data[i + 3] = Math.floor(intensity * 255 * (0.3 + rng() * 0.7)); // Alpha
  }

  ctx.putImageData(imgData, 0, 0);
  
  // Limit cache size
  if (tileCache.size > 20) {
    const firstKey = tileCache.keys().next().value;
    if (firstKey) tileCache.delete(firstKey);
  }

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * Applies grain noise overlay to a canvas context
 */
export function applyNoiseOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  seed: number
) {
  if (intensity <= 0) return;

  ctx.save();
  ctx.globalCompositeOperation = 'overlay';

  const noiseTile = getNoiseTile(intensity, seed);
  const pattern = ctx.createPattern(noiseTile, 'repeat');

  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
}
