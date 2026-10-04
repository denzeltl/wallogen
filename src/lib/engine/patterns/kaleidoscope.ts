import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const kaleidoscopePattern: WallpaperPattern = {
  id: 'kaleidoscope',
  name: 'Prism Geometry',
  description: 'Radiating crystalline geometry with multi-symmetry radial petals and polygon facets',
  category: 'geometric',
  defaultParams: {
    seed: 1313,
    scale: 1.0,
    density: 12,
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
      const symmetry = Math.max(4, Math.min(24, Math.floor(params.density)));
      const layers = Math.max(2, Math.min(10, Math.floor(params.complexity)));
      const minDim = Math.min(w, h);

      const cx = w / 2;
      const cy = h / 2;
      const maxRadius = minDim * 0.45 * params.scale;

      const angleStep = (Math.PI * 2) / symmetry;

      for (let l = layers; l >= 1; l--) {
        const layerRadius = (l / layers) * maxRadius;
        const color = colors[(l - 1) % colors.length];
        const nextColor = colors[l % colors.length];

        ctx.save();
        ctx.translate(cx, cy);

        for (let s = 0; s < symmetry; s++) {
          ctx.rotate(angleStep);

          // Petal/Facet geometry
          ctx.beginPath();
          ctx.moveTo(0, 0);

          const petalWidth = layerRadius * 0.35 * (0.8 + rng() * 0.4);
          ctx.quadraticCurveTo(petalWidth, layerRadius * 0.5, 0, layerRadius);
          ctx.quadraticCurveTo(-petalWidth, layerRadius * 0.5, 0, 0);

          const grad = ctx.createLinearGradient(0, 0, 0, layerRadius);
          grad.addColorStop(0, hexToRgba(color, 0.85));
          grad.addColorStop(1, hexToRgba(nextColor, 0.4));

          ctx.fillStyle = grad;
          ctx.fill();

          ctx.lineWidth = Math.max(1, (minDim / 600) * (l / layers));
          ctx.strokeStyle = hexToRgba(colors[0], 0.4);
          ctx.stroke();
        }

        ctx.restore();
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
