import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const voronoiPattern: WallpaperPattern = {
  id: 'voronoi',
  name: 'Voronoi Cellular',
  description: 'Geometric stained glass and crystal structure Voronoi tessellations',
  category: 'geometric',
  defaultParams: {
    seed: 808,
    scale: 1.0,
    density: 12,
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
      const cellCount = Math.max(5, Math.min(35, Math.floor(params.density)));

      // Generate seed points for Voronoi cells
      const points: { x: number; y: number; color: string; nextColor: string }[] = [];
      for (let i = 0; i < cellCount; i++) {
        points.push({
          x: w * (-0.1 + rng() * 1.2),
          y: h * (-0.1 + rng() * 1.2),
          color: colors[i % colors.length],
          nextColor: colors[(i + 1) % colors.length],
        });
      }

      // Draw cellular polygons
      const minDim = Math.min(w, h);
      const strokeWidth = Math.max(1, (minDim / 700) * (params.complexity * 0.4));

      // Draw radial gradient cell blobs centered at each site
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const radius = minDim * (0.2 + rng() * 0.3) * params.scale;

        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius);
        grad.addColorStop(0, hexToRgba(pt.color, 0.85));
        grad.addColorStop(0.7, hexToRgba(pt.nextColor, 0.4));
        grad.addColorStop(1, hexToRgba(background, 0));

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw Delaunay/Voronoi connecting geometric lines if complexity >= 2
      if (params.complexity >= 2) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = hexToRgba(colors[0], 0.25);

        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < minDim * 0.35 * params.scale) {
              ctx.beginPath();
              ctx.moveTo(points[i].x, points[i].y);
              ctx.lineTo(points[j].x, points[j].y);
              ctx.stroke();
            }
          }
        }
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
