import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const flowFieldPattern: WallpaperPattern = {
  id: 'flowField',
  name: 'Vector Flow Field',
  description: 'Mathematical flow field particle trails, magnetic vector currents, and organic fluid streams',
  category: 'abstract',
  defaultParams: {
    seed: 909,
    scale: 1.0,
    density: 16,
    complexity: 6,
    noiseIntensity: 0.05,
    rotation: 0,
  },
  render: (ctx, width, height, palette, params) => {
    const { background, colors } = palette;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    withCanvasRotation(ctx, width, height, params.rotation, (w, h) => {
      const rng = createPRNG(params.seed);
      const minDim = Math.min(w, h);
      const particleCount = Math.max(20, Math.min(150, Math.floor(params.density * 6)));
      const stepCount = Math.max(10, Math.min(80, Math.floor(params.complexity * 8)));

      ctx.lineWidth = Math.max(1, minDim * 0.002 * params.scale);

      for (let p = 0; p < particleCount; p++) {
        let x = rng() * w;
        let y = rng() * h;
        const color = colors[p % colors.length];
        const alpha = 0.35 + (rng() * 0.45);

        ctx.strokeStyle = hexToRgba(color, alpha);
        ctx.beginPath();
        ctx.moveTo(x, y);

        for (let s = 0; s < stepCount; s++) {
          // Calculate vector angle from mathematical noise simulation
          const angle = Math.sin(x * 0.003 * params.scale + params.seed) + Math.cos(y * 0.003 * params.scale + params.seed) * Math.PI * 2;
          const stepSize = minDim * 0.008;

          x += Math.cos(angle) * stepSize;
          y += Math.sin(angle) * stepSize;

          ctx.lineTo(x, y);
        }

        ctx.stroke();
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
