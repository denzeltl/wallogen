import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const wavesPattern: WallpaperPattern = {
  id: 'waves',
  name: 'Ocean Waves',
  description: 'Layered mathematical sine wave vectors with smooth color gradients & line highlights',
  category: 'minimal',
  defaultParams: {
    seed: 42,
    scale: 1.0,
    density: 8,
    complexity: 4,
    noiseIntensity: 0.08,
    rotation: 0,
  },
  render: (ctx, width, height, palette, params) => {
    const { background, colors } = palette;

    // 1. Fill Background
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    withCanvasRotation(ctx, width, height, params.rotation, (w, h) => {
      const rng = createPRNG(params.seed);
      const waveCount = Math.max(3, Math.min(24, Math.floor(params.density)));
      const complexity = Math.max(1, Math.min(10, Math.floor(params.complexity)));
      const minDim = Math.min(w, h);

      const stepY = h / (waveCount + 1);

      for (let i = 0; i < waveCount; i++) {
        const color = colors[i % colors.length];
        const nextColor = colors[(i + 1) % colors.length];

        const baseY = h * 0.15 + (i + 1) * (stepY * 0.85);
        const amplitude = minDim * 0.06 * params.scale * (0.7 + rng() * 0.6);
        const frequency = (0.003 / Math.max(0.2, params.scale)) * (1 + (i % 4) * 0.4);
        const phaseOffset = rng() * Math.PI * 2;

        ctx.beginPath();
        ctx.moveTo(-100, h + 100);
        ctx.lineTo(-100, baseY);

        const sampleSteps = Math.max(4, Math.ceil(w / (100 * Math.max(1, complexity * 0.5))));
        for (let x = -100; x <= w + 100; x += sampleSteps) {
          let y = baseY;
          for (let c = 1; c <= complexity; c++) {
            y += Math.sin(x * frequency * c + phaseOffset + c * 1.5) * (amplitude / (c * 0.9));
          }
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w + 100, h + 100);
        ctx.closePath();

        // Gradient fill
        const grad = ctx.createLinearGradient(0, baseY - amplitude, 0, h);
        const alpha = 0.9 - (i / waveCount) * 0.35;
        grad.addColorStop(0, hexToRgba(color, alpha));
        grad.addColorStop(1, hexToRgba(nextColor, Math.max(0.15, alpha - 0.5)));

        ctx.fillStyle = grad;
        ctx.fill();

        // Wave crest stroke highlight based on complexity
        if (complexity >= 3) {
          ctx.lineWidth = Math.max(1, (minDim / 600) * (params.scale * 0.8));
          ctx.strokeStyle = hexToRgba('#ffffff', 0.25);
          ctx.stroke();
        }
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
