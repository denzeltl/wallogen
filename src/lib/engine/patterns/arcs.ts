import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const arcsPattern: WallpaperPattern = {
  id: 'arcs',
  name: 'Geometric Arcs',
  description: 'Minimalist architectural arcs, overlapping hills, and celestial horizons',
  category: 'geometric',
  defaultParams: {
    seed: 303,
    scale: 1.0,
    density: 6,
    complexity: 4,
    noiseIntensity: 0.05,
    rotation: 0,
  },
  render: (ctx, width, height, palette, params) => {
    const { background, colors } = palette;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    withCanvasRotation(ctx, width, height, params.rotation, (w, h) => {
      const rng = createPRNG(params.seed);
      const arcCount = Math.max(2, Math.min(20, Math.floor(params.density)));
      const hillCount = Math.max(1, Math.min(10, Math.floor(params.complexity)));

      const minDim = Math.min(w, h);
      const cx = w / 2;
      const cy = h * 0.55;

      // 1. Celestial Sun/Moon Element
      const sunRadius = minDim * 0.18 * params.scale;
      const sunY = h * 0.35;
      const sunColor = colors[0];

      const sunGrad = ctx.createLinearGradient(cx, sunY - sunRadius, cx, sunY + sunRadius);
      sunGrad.addColorStop(0, hexToRgba(sunColor, 0.95));
      sunGrad.addColorStop(1, hexToRgba(colors[1] || sunColor, 0.6));

      ctx.beginPath();
      ctx.arc(cx, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();

      // 2. Architectural Concentric Arcs
      for (let i = 0; i < arcCount; i++) {
        const color = colors[(i + 1) % colors.length];
        const radius = minDim * (0.15 + i * 0.08) * params.scale;
        const strokeWidth = Math.max(1.5, (minDim / 400) * (2 + (i % 3)));

        ctx.beginPath();
        ctx.arc(cx, cy + i * (minDim * 0.03), radius, Math.PI, Math.PI * 2);

        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = hexToRgba(color, Math.max(0.2, 0.9 - i * 0.04));
        ctx.stroke();
      }

      // 3. Overlapping Geometric Dunes & Hills
      for (let i = 0; i < hillCount; i++) {
        const color = colors[(i + 2) % colors.length];
        const hillY = h * (0.55 + (i / Math.max(1, hillCount)) * 0.35);
        const hillRadius = w * (0.35 + rng() * 0.35) * params.scale;
        const hillX = w * (0.1 + (i / Math.max(1, hillCount)) * 0.8);

        ctx.beginPath();
        ctx.arc(hillX, hillY + hillRadius * 0.5, hillRadius, Math.PI * 1.1, Math.PI * 1.9);
        ctx.lineTo(w + 100, h + 100);
        ctx.lineTo(-100, h + 100);
        ctx.closePath();

        ctx.fillStyle = hexToRgba(color, 0.95 - (i / hillCount) * 0.3);
        ctx.fill();
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
