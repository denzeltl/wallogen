import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const gradientsPattern: WallpaperPattern = {
  id: 'gradients',
  name: 'Soft Gradients',
  description: 'Multi-stop linear and radial gradient blends with subtle light flares',
  category: 'gradient',
  defaultParams: {
    seed: 101,
    scale: 1.0,
    density: 6,
    complexity: 4,
    noiseIntensity: 0.06,
    rotation: 45,
  },
  render: (ctx, width, height, palette, params) => {
    const { background, colors } = palette;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    withCanvasRotation(ctx, width, height, params.rotation, (w, h) => {
      const rng = createPRNG(params.seed);
      const maxDim = Math.max(w, h);

      // 1. Base Linear Gradient
      const grad = ctx.createLinearGradient(0, 0, w * params.scale, h * params.scale);
      const stopCount = Math.max(2, Math.floor(params.density));

      for (let i = 0; i < stopCount; i++) {
        const stopPos = i / (stopCount - 1);
        const color = colors[i % colors.length];
        grad.addColorStop(stopPos, hexToRgba(color, 0.85));
      }

      ctx.fillStyle = grad;
      ctx.fillRect(-w * 0.5, -h * 0.5, w * 2, h * 2);

      // 2. Radial Light Flares based on Density & Complexity
      const flareCount = Math.max(1, Math.floor(params.complexity * 1.5));
      for (let i = 0; i < flareCount; i++) {
        const spotX = w * (0.1 + rng() * 0.8);
        const spotY = h * (0.1 + rng() * 0.8);
        const radius = maxDim * 0.45 * (0.5 + rng() * 0.8) * params.scale;
        const spotColor = colors[(i + 1) % colors.length];

        const radGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, radius);
        radGrad.addColorStop(0, hexToRgba(spotColor, 0.6));
        radGrad.addColorStop(0.6, hexToRgba(spotColor, 0.2));
        radGrad.addColorStop(1, hexToRgba(background, 0));

        ctx.fillStyle = radGrad;
        ctx.fillRect(-w * 0.5, -h * 0.5, w * 2, h * 2);
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
