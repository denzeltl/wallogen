import { WallpaperPattern } from '@/types';
import { createPRNG, hexToRgba, withCanvasRotation } from '../utils';
import { applyNoiseOverlay } from '../noise';

export const origamiPeaksPattern: WallpaperPattern = {
  id: 'origamiPeaks',
  name: 'Origami Peaks',
  description: 'Low-poly 3D triangular mountain peaks, crystalline terrain facets, and atmospheric elevation ridges',
  category: 'geometric',
  defaultParams: {
    seed: 101,
    scale: 1.0,
    density: 12,
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
      const minDim = Math.min(w, h);
      const baseHorizon = h * 0.55;

      // Sky Background Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, baseHorizon);
      skyGrad.addColorStop(0, hexToRgba(background, 1.0));
      skyGrad.addColorStop(1, hexToRgba(colors[0], 0.35));
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, baseHorizon);

      // Low-Poly Mountain Ridge Mesh Grid
      const colCount = Math.max(6, Math.min(24, Math.floor(params.density * 1.5)));
      const rowCount = Math.max(4, Math.min(12, Math.floor(params.complexity * 1.2)));

      const cellW = w / (colCount - 1);
      const cellH = (h - baseHorizon) / (rowCount - 1);

      // Generate 2D Grid of Vertices with Height Offsets
      const grid: { x: number; y: number }[][] = [];
      for (let r = 0; r < rowCount; r++) {
        const row: { x: number; y: number }[] = [];
        for (let c = 0; c < colCount; c++) {
          const isEdge = r === 0 || r === rowCount - 1 || c === 0 || c === colCount - 1;
          const jitterX = isEdge ? 0 : (rng() - 0.5) * cellW * 0.7;

          // Peak elevation increases toward center columns and upper rows
          const centerDist = 1 - Math.abs(c - colCount / 2) / (colCount / 2);
          const heightOffset = (r === 0 ? minDim * 0.35 * centerDist * params.scale : (rng() - 0.5) * cellH * 0.8);

          const x = c * cellW + jitterX;
          const y = baseHorizon + r * cellH - (r === 0 ? heightOffset : 0);
          row.push({ x, y });
        }
        grid.push(row);
      }

      // Draw Low-Poly Triangular Facets
      for (let r = 0; r < rowCount - 1; r++) {
        for (let c = 0; c < colCount - 1; c++) {
          const p1 = grid[r][c];
          const p2 = grid[r][c + 1];
          const p3 = grid[r + 1][c];
          const p4 = grid[r + 1][c + 1];

          const color1 = colors[(r + c) % colors.length];
          const color2 = colors[(r + c + 1) % colors.length];

          // Facet 1 (p1, p2, p3)
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();

          // Lighting factor based on slope angle
          const light1 = 0.5 + Math.sin(p2.x * 0.01 + p1.y * 0.01) * 0.35;
          ctx.fillStyle = hexToRgba(color1, 0.7 + light1 * 0.3);
          ctx.fill();
          ctx.strokeStyle = hexToRgba(background, 0.25);
          ctx.lineWidth = 1;
          ctx.stroke();

          // Facet 2 (p2, p4, p3)
          ctx.beginPath();
          ctx.moveTo(p2.x, p2.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();

          const light2 = 0.5 + Math.cos(p4.x * 0.01 + p2.y * 0.01) * 0.35;
          ctx.fillStyle = hexToRgba(color2, 0.65 + light2 * 0.35);
          ctx.fill();
          ctx.strokeStyle = hexToRgba(background, 0.25);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    applyNoiseOverlay(ctx, width, height, params.noiseIntensity, params.seed);
  },
};
