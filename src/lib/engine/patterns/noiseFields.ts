import { WallpaperPattern } from '@/types';
import { createPRNG, createNoise2D, interpolateHexColor, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const noiseFieldsPattern: WallpaperPattern = {
  id: 'noiseFields',
  name: 'Cosmic Noise Fields',
  description: 'Organic Perlin/Simplex multi-octave noise clouds, plasma fields, and nebula light',
  category: 'abstract',
  defaultParams: {
    seed: 707,
    scale: 1.0,
    density: 8,
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
      const noise2D = createNoise2D(params.seed);

      const maxDim = Math.max(w, h);
      const octaves = Math.max(1, Math.min(6, Math.floor(params.complexity * 0.7)));
      const blobCount = Math.max(4, Math.min(24, Math.floor(params.density)));

      // Render layered multi-frequency noise field blobs for performance & resolution sharpness
      for (let i = 0; i < blobCount; i++) {
        const color1 = colors[i % colors.length];
        const color2 = colors[(i + 1) % colors.length];

        const cx = w * (0.1 + rng() * 0.8);
        const cy = h * (0.1 + rng() * 0.8);
        const radius = maxDim * (0.2 + rng() * 0.4) * params.scale;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, color1);
        grad.addColorStop(0.5, color2);
        grad.addColorStop(1, background);

        ctx.save();
        ctx.beginPath();

        const points = 120;
        const angleStep = (Math.PI * 2) / points;

        for (let p = 0; p <= points; p++) {
          const angle = p * angleStep;
          let noiseVal = 0;
          let amp = 1;
          let freq = (0.8 / Math.max(0.2, params.scale)) * (params.density * 0.1);

          for (let o = 0; o < octaves; o++) {
            const nx = (cx / w) * freq + Math.cos(angle) * freq;
            const ny = (cy / h) * freq + Math.sin(angle) * freq;
            noiseVal += noise2D(nx, ny) * amp;
            amp *= 0.5;
            freq *= 2;
          }

          const r = radius * (0.7 + noiseVal * 0.5);
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;

          if (p === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.55;
        ctx.fill();
        ctx.restore();
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
