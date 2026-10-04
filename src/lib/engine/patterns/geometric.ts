import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const geometricPattern: WallpaperPattern = {
  id: 'geometric',
  name: 'Bauhaus Geometry',
  description: 'Minimalist floating geometric shapes, architectural polygons, and balance compositions',
  category: 'geometric',
  defaultParams: {
    seed: 505,
    scale: 1.0,
    density: 8,
    complexity: 4,
    noiseIntensity: 0.06,
    rotation: 0,
  },
  render: (ctx, width, height, palette, params) => {
    const { background, colors } = palette;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    withCanvasRotation(ctx, width, height, params.rotation, (w, h) => {
      const rng = createPRNG(params.seed);
      const shapeCount = Math.max(3, Math.min(25, Math.floor(params.density)));
      const complexity = Math.max(1, Math.min(8, Math.floor(params.complexity)));
      const minDim = Math.min(w, h);

      // Background Subtle Grid Lines if complexity >= 3
      if (complexity >= 3) {
        ctx.strokeStyle = hexToRgba(colors[0], 0.08);
        ctx.lineWidth = 1;
        const gridSize = minDim * 0.1 * params.scale;
        for (let x = 0; x <= w; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y <= h; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      // Floating Geometric Composition Shapes
      for (let i = 0; i < shapeCount; i++) {
        const color = colors[i % colors.length];
        const nextColor = colors[(i + 1) % colors.length];

        const cx = w * (0.1 + rng() * 0.8);
        const cy = h * (0.1 + rng() * 0.8);
        const size = minDim * (0.05 + rng() * 0.25) * params.scale;
        const shapeType = Math.floor(rng() * 4); // 0: Circle, 1: Rectangle, 2: Triangle, 3: Ring

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((rng() * Math.PI) / 2);

        if (shapeType === 0) {
          // Circle / Half Circle
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, rng() > 0.5 ? Math.PI * 2 : Math.PI);
          ctx.fillStyle = hexToRgba(color, 0.85);
          ctx.fill();
        } else if (shapeType === 1) {
          // Rounded Rect
          ctx.fillStyle = hexToRgba(color, 0.8);
          ctx.fillRect(-size / 2, -size / 2, size, size * (0.5 + rng()));
        } else if (shapeType === 2) {
          // Triangle
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size, size);
          ctx.lineTo(-size, size);
          ctx.closePath();
          ctx.fillStyle = hexToRgba(nextColor, 0.85);
          ctx.fill();
        } else {
          // Ring / Stroke polygon
          ctx.beginPath();
          ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2);
          ctx.lineWidth = Math.max(2, size * 0.1);
          ctx.strokeStyle = hexToRgba(color, 0.9);
          ctx.stroke();
        }

        ctx.restore();
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
