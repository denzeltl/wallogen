import { WallpaperPattern } from '@/types';
import { createPRNG, createNoise2D, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const topographyPattern: WallpaperPattern = {
  id: 'topography',
  name: 'Contour Topography',
  description: 'Abstract contour map line art vectors simulating topographical elevation maps',
  category: 'abstract',
  defaultParams: {
    seed: 404,
    scale: 1.0,
    density: 16,
    complexity: 5,
    noiseIntensity: 0.05,
    rotation: 0,
  },
  render: (ctx, width, height, palette, params) => {
    const { background, colors } = palette;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    withCanvasRotation(ctx, width, height, params.rotation, (w, h) => {
      const rng = createPRNG(params.seed);
      const noise2D = createNoise2D(params.seed);
      const lineCount = Math.max(5, Math.min(45, Math.floor(params.density)));
      const complexity = Math.max(1, Math.min(10, Math.floor(params.complexity)));

      const minDim = Math.min(w, h);
      const strokeWidth = Math.max(1, (minDim / 800) * 1.5);
      ctx.lineWidth = strokeWidth;

      const focalX = w * (0.3 + rng() * 0.4);
      const focalY = h * (0.3 + rng() * 0.4);
      const maxRadius = Math.max(w, h) * 0.85 * params.scale;

      for (let i = 1; i <= lineCount; i++) {
        const baseRadius = (i / lineCount) * maxRadius;
        const color = colors[i % colors.length];

        ctx.beginPath();
        const points = 160;
        const angleStep = (Math.PI * 2) / points;

        for (let p = 0; p <= points; p++) {
          const angle = p * angleStep;
          const nx = Math.cos(angle) * (complexity * 0.5) + i * 0.1;
          const ny = Math.sin(angle) * (complexity * 0.5) + i * 0.1;
          
          const noiseVal = noise2D(nx, ny);
          const distortion = noiseVal * (minDim * 0.08 * (params.scale * 0.8));

          const r = baseRadius + distortion;
          const x = focalX + Math.cos(angle) * r;
          const y = focalY + Math.sin(angle) * r;

          if (p === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();
        ctx.strokeStyle = hexToRgba(color, 0.8);
        ctx.stroke();
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
