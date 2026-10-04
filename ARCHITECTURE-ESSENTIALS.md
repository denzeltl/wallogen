# Architecture Essentials & Developer Guide — Wallogen

## 1. Core Engineering Principles

1. **Client-Side Pure Canvas:** All wallpaper rendering happens in the browser canvas. Never introduce server-side canvas generation dependencies.
2. **Relative Coordinates:** Always express coordinates as ratios of `width` and `height` ($x \cdot w$, $y \cdot h$) to ensure identical visual output across 720p preview and 8K export.
3. **Immutability & Determinism:** Given the same `seed`, `palette`, and `params`, `render()` must produce 100% identical pixel output every single time.
4. **Zero-Lag UI Interaction:** Canvas redraws triggered by range sliders must complete under 16ms (60 FPS) on the preview canvas.

---

## 2. How to Add a New Wallpaper Pattern (Step-by-Step)

Adding a new pattern requires 3 steps:

### Step 1: Create Pattern Renderer (`src/lib/engine/patterns/myPattern.ts`)
```typescript
import { WallpaperPattern, Palette, PatternParams } from '../types';

export const myPattern: WallpaperPattern = {
  id: 'my-pattern',
  name: 'My Custom Pattern',
  description: 'Clean minimalist geometric shapes',
  category: 'minimal',
  defaultParams: {
    seed: 42,
    scale: 1.0,
    density: 5,
    complexity: 3,
    noiseIntensity: 0.05,
    rotation: 0,
  },
  render: (ctx, width, height, palette, params) => {
    // 1. Draw Background
    ctx.fillStyle = palette.background;
    ctx.fillRect(0, 0, width, height);

    // 2. Compute Relative Dimensions
    const minDim = Math.min(width, height);
    
    // 3. Render Geometry using relative math & palette.colors
    ctx.save();
    ctx.fillStyle = palette.colors[0];
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, minDim * 0.3 * params.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
```

### Step 2: Register Pattern in Engine (`src/lib/engine/index.ts`)
```typescript
import { myPattern } from './patterns/myPattern';

export const PATTERNS = [
  wavesPattern,
  gradientsPattern,
  meshGradientsPattern,
  arcsPattern,
  topographyPattern,
  myPattern, // Add new pattern here
];
```

### Step 3: Verify Render & Export
* Open the Generator App in dev server (`npm run dev`).
* Select **My Custom Pattern** from the pattern dropdown.
* Verify real-time slider controls and trigger an export test at **4K Desktop (3840×2160)**.

---

## 3. High-Resolution Canvas Math Checklist

* **Line Thickness:** Always scale stroke widths by resolution ratio:
  ```typescript
  const strokeWidth = Math.max(1, (Math.min(width, height) / 1000) * baseThickness);
  ctx.lineWidth = strokeWidth;
  ```
* **Font Sizes (if typography used):** Scale font sizes dynamically:
  ```typescript
  const fontSize = height * 0.04;
  ctx.font = `${fontSize}px Inter, sans-serif`;
  ```
* **Noise Grain Pass:** Use deterministic pseudo-random seeds (`Math.sin(seed++)`) so noise texture stays locked when zooming or re-exporting.

---

## 4. State & Parameter Schema Quick Reference

| State Property | Type | Description |
| :--- | :--- | :--- |
| `selectedPatternId` | `string` | Unique ID of active pattern renderer |
| `selectedPaletteId` | `string` | ID of active color palette |
| `customPalette` | `Palette \| null` | User-configured hex colors (overrides palette ID if set) |
| `devicePreset` | `DevicePreset` | Active screen size target (`4k`, `mobile_iphone`, `custom`, etc.) |
| `customWidth` | `number` | Width in px when `devicePreset === 'custom'` |
| `customHeight` | `number` | Height in px when `devicePreset === 'custom'` |
| `params` | `PatternParams` | Current slider state (`seed`, `scale`, `density`, `noiseIntensity`) |
