import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const glassmorphismPattern: WallpaperPattern = {
  id: 'glassmorphism',
  name: 'Glass Prism',
  description: 'Translucent frosted glass panels, ambient gradient blurs, and soft specular light edges',
  category: 'minimal',
  defaultParams: {
    seed: 505,
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

      // Background Ambient Glow Orbs
      const orbCount = 3;
      for (let i = 0; i < orbCount; i++) {
        const ox = w * (0.2 + rng() * 0.6);
        const oy = h * (0.2 + rng() * 0.6);
        const or = minDim * (0.25 + rng() * 0.3) * params.scale;
        const color = colors[i % colors.length];

        const orbGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, or);
        orbGrad.addColorStop(0, hexToRgba(color, 0.7));
        orbGrad.addColorStop(0.6, hexToRgba(color, 0.25));
        orbGrad.addColorStop(1, hexToRgba(background, 0));

        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(ox, oy, or, 0, Math.PI * 2);
        ctx.fill();
      }

      // Frosted Glass Overlapping Rectangular / Curved Panels
      const panelCount = Math.max(2, Math.min(10, Math.floor(params.density)));

      for (let i = 0; i < panelCount; i++) {
        const px = w * (0.15 + rng() * 0.7);
        const py = h * (0.15 + rng() * 0.7);
        const pw = minDim * (0.2 + rng() * 0.35) * params.scale;
        const ph = pw * (0.6 + rng() * 0.8);
        const radius = Math.min(pw, ph) * 0.15;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate((rng() - 0.5) * 0.4);

        // Glass Panel Fill Gradient
        const glassGrad = ctx.createLinearGradient(-pw / 2, -ph / 2, pw / 2, ph / 2);
        glassGrad.addColorStop(0, hexToRgba('#ffffff', 0.12));
        glassGrad.addColorStop(0.5, hexToRgba(colors[i % colors.length], 0.08));
        glassGrad.addColorStop(1, hexToRgba('#ffffff', 0.04));

        // Draw Rounded Panel
        ctx.beginPath();
        ctx.roundRect(-pw / 2, -ph / 2, pw, ph, radius);
        ctx.fillStyle = glassGrad;
        ctx.fill();

        // Specular Glass Edge Reflection Highlight
        ctx.strokeStyle = hexToRgba('#ffffff', 0.22);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
