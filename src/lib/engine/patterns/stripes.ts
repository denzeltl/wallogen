import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const stripesPattern: WallpaperPattern = {
  id: 'stripes',
  name: 'Curved Line Art',
  description: 'Precision parallel line ribbons with wave modulation and varying stroke weights',
  category: 'minimal',
  defaultParams: {
    seed: 909,
    scale: 1.0,
    density: 16,
    complexity: 4,
    noiseIntensity: 0.05,
    rotation: 45,
  },
  render: (ctx, width, height, palette, params) => {
    const { background, colors } = palette;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    withCanvasRotation(ctx, width, height, params.rotation, (w, h) => {
      const rng = createPRNG(params.seed);
      const stripeCount = Math.max(6, Math.min(45, Math.floor(params.density)));
      const complexity = Math.max(1, Math.min(8, Math.floor(params.complexity)));
      const minDim = Math.min(w, h);

      const spacing = (h * 1.2) / stripeCount;

      for (let i = 0; i < stripeCount; i++) {
        const color = colors[i % colors.length];
        const baseY = -h * 0.1 + i * spacing;

        const amplitude = minDim * 0.04 * params.scale * (0.6 + rng() * 0.8);
        const frequency = 0.003 / Math.max(0.2, params.scale);
        const strokeWidth = Math.max(1, (minDim / 500) * (1 + (i % 4) * 0.8) * params.scale);

        ctx.beginPath();
        const steps = Math.ceil(w / 10);

        for (let x = -50; x <= w + 50; x += steps) {
          let y = baseY;
          for (let c = 1; c <= complexity; c++) {
            y += Math.sin(x * frequency * c + i * 0.4) * (amplitude / c);
          }

          if (x === -50) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = hexToRgba(color, 0.85);
        ctx.stroke();
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
