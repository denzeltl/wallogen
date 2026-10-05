import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const lightRaysPattern: WallpaperPattern = {
  id: 'lightRays',
  name: 'Volumetric Light',
  description: 'Soft volumetric atmosphere, misty light shafts, and elegant ambient light beams',
  category: 'minimal',
  defaultParams: {
    seed: 606,
    scale: 1.0,
    density: 8,
    complexity: 4,
    noiseIntensity: 0.04,
    rotation: 0,
  },
  render: (ctx, width, height, palette, params) => {
    const { background, colors } = palette;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    withCanvasRotation(ctx, width, height, params.rotation, (w, h) => {
      const rng = createPRNG(params.seed);
      const minDim = Math.min(w, h);
      const maxDim = Math.max(w, h);

      // Light Origin (top corner or top edge)
      const originX = w * (0.1 + rng() * 0.8);
      const originY = -h * 0.1;

      // Atmospheric Background Diffusion
      const bgGrad = ctx.createRadialGradient(originX, 0, minDim * 0.1, originX, 0, maxDim);
      bgGrad.addColorStop(0, hexToRgba(colors[0], 0.5));
      bgGrad.addColorStop(0.5, hexToRgba(colors[1 % colors.length], 0.2));
      bgGrad.addColorStop(1, hexToRgba(background, 1.0));
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Soft Volumetric Light Beams
      const rayCount = Math.max(4, Math.min(16, Math.floor(params.density)));

      for (let i = 0; i < rayCount; i++) {
        const spread = (w * (0.05 + rng() * 0.12)) * params.scale;
        const targetX = w * (i / rayCount) + (rng() - 0.5) * w * 0.2;
        const color = colors[i % colors.length];

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(targetX - spread, h * 1.2);
        ctx.lineTo(targetX + spread, h * 1.2);
        ctx.closePath();

        const beamGrad = ctx.createLinearGradient(originX, originY, targetX, h);
        beamGrad.addColorStop(0, hexToRgba(color, 0.45));
        beamGrad.addColorStop(0.5, hexToRgba(color, 0.18));
        beamGrad.addColorStop(1, hexToRgba(color, 0));

        ctx.fillStyle = beamGrad;
        ctx.fill();
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
