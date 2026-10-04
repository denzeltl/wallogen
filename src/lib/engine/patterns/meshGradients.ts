import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const meshGradientsPattern: WallpaperPattern = {
  id: 'meshGradients',
  name: 'Mesh Aura',
  description: 'Organic gaussian color mesh blobs blending into a glowing aura',
  category: 'gradient',
  defaultParams: {
    seed: 202,
    scale: 1.2,
    density: 8,
    complexity: 4,
    noiseIntensity: 0.08,
    rotation: 0,
  },
  render: (ctx, width, height, palette, params) => {
    const { background, colors } = palette;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    withCanvasRotation(ctx, width, height, params.rotation, (w, h) => {
      const rng = createPRNG(params.seed);
      const blobCount = Math.max(3, Math.min(25, Math.floor(params.density)));
      const maxDim = Math.max(w, h);

      for (let i = 0; i < blobCount; i++) {
        const color = colors[i % colors.length];

        const cx = w * (-0.1 + rng() * 1.2);
        const cy = h * (-0.1 + rng() * 1.2);
        const radius = maxDim * (0.2 + rng() * 0.4) * params.scale;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, hexToRgba(color, 0.75));
        grad.addColorStop(0.5, hexToRgba(color, 0.3));
        grad.addColorStop(1, hexToRgba(background, 0));

        ctx.fillStyle = grad;

        const scaleX = 0.6 + rng() * (0.4 + params.complexity * 0.15);
        const scaleY = 0.6 + rng() * (0.4 + params.complexity * 0.15);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rng() * Math.PI * 2);
        ctx.scale(scaleX, scaleY);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
