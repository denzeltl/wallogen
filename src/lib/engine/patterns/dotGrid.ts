import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const dotGridPattern: WallpaperPattern = {
  id: 'dotGrid',
  name: 'Halftone Dot Grid',
  description: 'Procedural dot matrices with sine wave radius modulation and color gradients',
  category: 'minimal',
  defaultParams: {
    seed: 1010,
    scale: 1.0,
    density: 18,
    complexity: 3,
    noiseIntensity: 0.05,
    rotation: 0,
  },
  render: (ctx, width, height, palette, params) => {
    const { background, colors } = palette;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    withCanvasRotation(ctx, width, height, params.rotation, (w, h) => {
      const rng = createPRNG(params.seed);
      const gridDensity = Math.max(8, Math.min(40, Math.floor(params.density)));
      const minDim = Math.min(w, h);

      const stepX = w / gridDensity;
      const stepY = h / gridDensity;

      const focalX = w * (0.3 + rng() * 0.4);
      const focalY = h * (0.3 + rng() * 0.4);

      for (let x = stepX / 2; x < w; x += stepX) {
        for (let y = stepY / 2; y < h; y += stepY) {
          const dx = x - focalX;
          const dy = y - focalY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Wave pulse modulation for dot size
          const pulse =
            Math.sin(dist * (0.01 * params.complexity) - params.seed) * 0.5 + 0.5;
          const maxDotRadius = Math.min(stepX, stepY) * 0.45 * params.scale;
          const dotRadius = Math.max(1, maxDotRadius * (0.2 + pulse * 0.8));

          // Color selection based on distance
          const colorIndex = Math.floor((dist / minDim) * colors.length) % colors.length;
          const color = colors[colorIndex];

          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(color, 0.85);
          ctx.fill();
        }
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
