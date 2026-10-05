# Wallogen — Minimalist Wallpaper Generator

Wallogen is a minimalist, high-resolution procedural wallpaper generator and landing page web application built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and the **HTML5 Canvas 2D API**.

It allows users to generate crisp, aesthetically refined wallpapers for 4K/8K desktop displays, ultrawide setups, iPhones, Android devices, and tablets — 100% in the browser with zero tracking, no accounts, and zero server latency.

---

## ✨ Features

- 🎨 **14 Procedural Engines:** Sine Waves, Gaussian Mesh Gradients, Topography Lines, Silk Flow Fields, Voronoi Tessellations, Aurora Borealis, Kaleidoscope, Geometric Arcs, Noise Fields, Dot Grids, Stripes, Layered Circles, and Mesh Blends.
- 🌈 **Curated Color Palettes:** Nord, Gruvbox, Cyberpunk, Tokyo Night, Dracula, Sunset, Forest, Monochrome, and a dynamic **Random Palette** generator + custom swatch editor.
- 📐 **Device & Resolution Presets:**
  - **Desktop 4K UHD:** `3840 × 2160` (16:9)
  - **Desktop 8K UHD:** `7680 × 4320` (16:9)
  - **Ultrawide 5K:** `5120 × 1440` (21:9)
  - **iPhone 15 Pro:** `1179 × 2556` (19.5:9)
  - **Android Flagship:** `1440 × 3088` (20:9)
  - **Tablet / iPad:** `2048 × 2732` (4:3)
  - **Custom Dimensions:** User-defined width & height up to 8192px.
- ⚡ **100% Client-Side Offscreen Export:** Native high-DPI PNG and JPG downloads rendered directly in the browser via an offscreen HTML5 Canvas.
- 📱 **Interactive Studio Playground:** Live dual-display preview with real-time parameter tuning (seed, scale, density, complexity, film grain, and rotation angle).
- ✨ **Describe a Wallpaper (AI):** Type a mood like *"calm ocean at dusk"* and Google Gemini picks the pattern, palette and settings. The engine still renders locally, so AI results stay sharp at 8K and fully editable. Falls back to an on-device keyword match when the free AI quota is used up.
- 🔒 **Privacy First:** No accounts, no tracking, zero image uploads. The only thing that ever leaves your browser is the text prompt, and only when you use the AI prompt bar.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Graphics:** HTML5 Canvas 2D API (Procedural vector math)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Smooth Scroll:** [@studio-freight/lenis](https://github.com/darkroomengineering/lenis)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** `v18.0.0` or higher
- **npm:** `v9.0.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/wallogen.git
   cd wallogen
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the local development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Optional: enable the AI prompt bar

The "Describe a wallpaper" feature uses Google's free Gemini API tier. Without a key, it still works using an on-device keyword match.

1. Create a free API key at [Google AI Studio](https://aistudio.google.com/apikey).
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY`. `GEMINI_MODEL` is optional.
3. Restart `npm run dev`. On Vercel, add the same variables under **Project → Settings → Environment Variables**.

The key is only read by the server route `src/app/api/ai/generate/route.ts`. Never prefix it with `NEXT_PUBLIC_`.

---

## 📂 Project Structure

```text
wallogen/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Landing page with interactive preview & features
│   │   ├── generate/page.tsx      # Full-screen wallpaper generator application
│   │   ├── layout.tsx             # Root layout & global metadata
│   │   └── globals.css            # Tailwind & global CSS styles
│   ├── components/
│   │   ├── generator/             # Generator app UI (CanvasViewport, ControlsPanel, etc.)
│   │   ├── landing/               # Landing page sections (Hero, Features, Gallery, FAQ)
│   │   ├── ui/                    # Reusable UI primitives (Slider, Buttons)
│   │   └── WallogenLogo.tsx       # Procedural cyan SVG emblem
│   ├── lib/
│   │   ├── devices.ts             # Device resolution presets & aspect ratios
│   │   ├── palettes/              # Curated color palettes & color math
│   │   └── engine/
│   │       ├── index.ts           # Master pattern registry & render executor
│   │       └── patterns/          # Individual 2D procedural pattern renderers
│   └── types/                     # TypeScript interface definitions
├── PRD.md                         # Product requirements document
├── ARCHITECTURE.md                # System architecture documentation
└── README.md                      # Project documentation
```

---

## 🏗️ Adding a New Wallpaper Pattern

To create and register a new procedural pattern:

1. Create a renderer file under `src/lib/engine/patterns/[name].ts` implementing the `WallpaperPattern` interface:
   ```typescript
   import { WallpaperPattern } from '@/types';

   export const myCustomPattern: WallpaperPattern = {
     id: 'myCustomPattern',
     name: 'My Custom Pattern',
     description: 'Brief description of procedural output.',
     category: 'abstract',
     defaultParams: { seed: 42, scale: 1, density: 10, complexity: 5, noiseIntensity: 0, rotation: 0 },
     render(ctx, width, height, palette, params) {
       // Canvas 2D drawing logic...
     },
   };
   ```
2. Register the engine in `src/lib/engine/index.ts`:
   ```typescript
   import { myCustomPattern } from './patterns/myCustomPattern';

   export const PATTERNS = [
     // ... existing patterns
     myCustomPattern,
   ];
   ```

---

## 💖 Support the Creator

If Wallogen saved you time, enhanced your desktop setup, or brought value to your workflow, consider supporting future development:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-amber?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/denzeltl)

---

## 📜 License

Distributed under the [MIT License](LICENSE).
