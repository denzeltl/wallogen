import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const auroraPattern: WallpaperPattern = {
  id: 'aurora',
  name: 'Northern Lights',
  description: 'Ethereal vertical light curtains with flowing wave boundaries and glowing light passes',
  category: 'gradient',
  defaultParams: {
    seed: 1212,
    scale: 1.0,
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
      const curtainCount = Math.max(3, Math.min(16, Math.floor(params.density)));
      const complexity = Math.max(1, Math.min(8, Math.floor(params.complexity)));
      const minDim = Math.min(w, h);

      for (let i = 0; i < curtainCount; i++) {
        const color = colors[i % colors.length];
        const nextColor = colors[(i + 1) % colors.length];

        const baseX = w * (0.05 + (i / curtainCount) * 0.9);
        const curtainWidth = w * (0.15 + rng() * 0.25) * params.scale;
        const amplitude = minDim * 0.05 * params.scale * (0.7 + rng() * 0.6);
        const frequency = 0.003 / Math.max(0.2, params.scale);

        const grad = ctx.createLinearGradient(baseX, 0, baseX + curtainWidth, h);
        grad.addColorStop(0, hexToRgba(color, 0));
        grad.addColorStop(0.3, hexToRgba(color, 0.7));
        grad.addColorStop(0.7, hexToRgba(nextColor, 0.5));
        grad.addColorStop(1, hexToRgba(background, 0));

        ctx.beginPath();
        ctx.moveTo(baseX, -50);

        const steps = Math.ceil(h / 10);
        for (let y = -50; y <= h + 50; y += steps) {
          let x = baseX;
          for (let c = 1; c <= complexity; c++) {
            x += Math.sin(y * frequency * c + i * 0.6) * (amplitude / c);
          }
          ctx.lineTo(x, y);
        }

        for (let y = h + 50; y >= -50; y -= steps) {
          let x = baseX + curtainWidth;
          for (let c = 1; c <= complexity; c++) {
            x += Math.sin(y * frequency * c + i * 0.6 + 1) * (amplitude / c);
          }
          ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
