import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const layeredCirclesPattern: WallpaperPattern = {
  id: 'layeredCircles',
  name: 'Orbital Rings',
  description: 'Concentric rings, floating orbital spheres, and celestial balance compositions',
  category: 'geometric',
  defaultParams: {
    seed: 1111,
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
      const ringGroupCount = Math.max(2, Math.min(10, Math.floor(params.density * 0.5)));
      const minDim = Math.min(w, h);

      for (let g = 0; g < ringGroupCount; g++) {
        const cx = w * (0.2 + rng() * 0.6);
        const cy = h * (0.2 + rng() * 0.6);
        const maxRadius = minDim * (0.15 + rng() * 0.3) * params.scale;
        const ringCount = Math.max(2, Math.min(8, Math.floor(params.complexity)));

        for (let r = 0; r < ringCount; r++) {
          const color = colors[(g + r) % colors.length];
          const radius = (r / ringCount) * maxRadius;
          const strokeWidth = Math.max(1.5, (minDim / 400) * (2 + (r % 2)));

          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);

          if (r % 2 === 0) {
            ctx.fillStyle = hexToRgba(color, 0.35);
            ctx.fill();
          }

          ctx.lineWidth = strokeWidth;
          ctx.strokeStyle = hexToRgba(color, 0.85);
          ctx.stroke();

          // Satellite floating sphere along orbit
          if (r > 0 && rng() > 0.4) {
            const orbitAngle = rng() * Math.PI * 2;
            const satX = cx + Math.cos(orbitAngle) * radius;
            const satY = cy + Math.sin(orbitAngle) * radius;
            const satRadius = minDim * 0.02 * params.scale;

            ctx.beginPath();
            ctx.arc(satX, satY, satRadius, 0, Math.PI * 2);
            ctx.fillStyle = hexToRgba(colors[(r + 1) % colors.length], 0.9);
            ctx.fill();
          }
        }
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
