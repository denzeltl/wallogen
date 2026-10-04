/**
 * Mulberry32 Seeded Random Number Generator
 */
export function createPRNG(seed: number): () => number {
  let s = Math.floor(seed) || 12345;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Clamp helper
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Parse Hex color to RGB object
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  const num = parseInt(c, 16) || 0;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Convert HEX color to RGBA string with custom alpha
 */
export function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

/**
 * Check if a hex color is light/bright to choose adaptive contrast text
 */
export function isColorLight(colorStr: string): boolean {
  if (!colorStr) return false;
  if (colorStr.startsWith('#')) {
    const { r, g, b } = hexToRgb(colorStr);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
  }
  return false;
}

/**
 * Linearly interpolate between two hex colors by factor t (0..1)
 */
export function interpolateHexColor(color1: string, color2: string, t: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const factor = clamp(t, 0, 1);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Executes a rendering callback inside a rotated canvas context frame,
 * scaling slightly to guarantee complete coverage of canvas corners at any angle.
 */
export function withCanvasRotation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rotationDegrees: number,
  drawCallback: (w: number, h: number) => void
) {
  if (!rotationDegrees) {
    drawCallback(width, height);
    return;
  }

  const rad = (rotationDegrees * Math.PI) / 180;
  const diagonal = Math.sqrt(width * width + height * height);
  const scaleMult = diagonal / Math.min(width, height);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(rad);
  ctx.scale(scaleMult, scaleMult);
  ctx.translate(-width / 2, -height / 2);

  drawCallback(width, height);

  ctx.restore();
}

/**
 * Fast 2D Value Noise generator for organic procedural patterns
 */
export function createNoise2D(seed: number) {
  const rng = createPRNG(seed);
  const p: number[] = new Array(256);
  for (let i = 0; i < 256; i++) p[i] = Math.floor(rng() * 256);
  const perm = new Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  function fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(t: number, a: number, b: number) {
    return a + t * (b - a);
  }

  function grad(hash: number, x: number, y: number) {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  return function noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = fade(xf);
    const v = fade(yf);

    const A = perm[X] + Y;
    const B = perm[X + 1] + Y;

    const g00 = grad(perm[A], xf, yf);
    const g10 = grad(perm[B], xf - 1, yf);
    const g01 = grad(perm[A + 1], xf, yf - 1);
    const g11 = grad(perm[B + 1], xf - 1, yf - 1);

    return lerp(v, lerp(u, g00, g10), lerp(u, g01, g11));
  };
}
