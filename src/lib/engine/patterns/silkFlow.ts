import { WallpaperPattern } from '@/types';
import { createPRNG, createNoise2D, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const silkFlowPattern: WallpaperPattern = {
  id: 'silkFlow',
  name: 'Liquid Silk',
  description: 'Smooth procedural flow field ribbons creating organic fluid silk curves',
  category: 'abstract',
  defaultParams: {
    seed: 606,
    scale: 1.0,
    density: 12,
    complexity: 5,
    noiseIntensity: 0.06,
    rotation: 0,
  },
  render: (ctx, width, height, palette, params) => {
    const { background, colors } = palette;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    withCanvasRotation(ctx, width, height, params.rotation, (w, h) => {
      const rng = createPRNG(params.seed);
      const noise2D = createNoise2D(params.seed);
      const ribbonCount = Math.max(4, Math.min(30, Math.floor(params.density)));
      const complexity = Math.max(1, Math.min(10, Math.floor(params.complexity)));
      const minDim = Math.min(w, h);

      for (let i = 0; i < ribbonCount; i++) {
        const color = colors[i % colors.length];
        const strokeWidth = Math.max(1, (minDim / 600) * (2 + (i % 3) * 1.5) * params.scale);

        let currX = w * (0.05 + rng() * 0.9);
        let currY = h * (0.05 + rng() * 0.9);

        ctx.beginPath();
        ctx.moveTo(currX, currY);

        const steps = 120;
        const stepSize = minDim * 0.015 * params.scale;

        for (let s = 0; s < steps; s++) {
          const angle =
            noise2D(currX * (0.001 * complexity), currY * (0.001 * complexity)) *
            Math.PI *
            4;

          currX += Math.cos(angle) * stepSize;
          currY += Math.sin(angle) * stepSize;

          ctx.lineTo(currX, currY);
        }

        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = hexToRgba(color, 0.75 - (i / ribbonCount) * 0.3);
        ctx.stroke();
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
