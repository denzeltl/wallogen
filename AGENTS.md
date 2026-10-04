# AI Agent Operational Rules & Codebase Guide — Wallogen

## 1. Project Summary & Quick Map

Wallogen is a minimalist, high-resolution wallpaper generator web application and showcase landing page built with Next.js (App Router), TypeScript, Tailwind CSS, and HTML5 Canvas 2D.

### Key Documentation Files
* [PRD.md](file:///c:/Users/Denzel/Desktop/Vibe%20code/wallogen/PRD.md) — Product requirements, feature specs, target devices, and roadmap.
* [ARCHITECTURE.md](file:///c:/Users/Denzel/Desktop/Vibe%20code/wallogen/ARCHITECTURE.md) — System architecture, subsystem data flow, pattern engine, and directory structure.
* [ARCHITECTURE-ESSENTIALS.md](file:///c:/Users/Denzel/Desktop/Vibe%20code/wallogen/ARCHITECTURE-ESSENTIALS.md) — Essential rendering math, developer guidelines, and pattern registration contracts.

---

## 2. Agent Guidelines & Coding Standards

### 2.1. Code Quality & Conventions
* **TypeScript Strictness:** Never use `any`. Define explicit interfaces in `src/types/` or engine modules.
* **Functional React Components:** Use functional components with hooks. Avoid inline style objects when Tailwind classes are applicable.
* **Canvas Direct Rendering:** Keep pattern rendering functions pure, deterministic, and isolated in `src/lib/engine/patterns/`.
* **No Symptom Patching:** If a canvas render fails or exports blank, inspect resolution allocation and scale factor math rather than suppressing errors.

### 2.2. File & Directory Conventions
* **Pages & Routes:** `src/app/page.tsx` (Landing Page), `src/app/generate/page.tsx` (Generator Application).
* **Components:** `src/components/landing/` for marketing sections, `src/components/generator/` for application UI.
* **Pattern Engines:** `src/lib/engine/patterns/` (1 file per pattern renderer).
* **Color Palettes:** `src/lib/palettes/` (Presets and color math utilities).

---

## 3. Essential Commands & Workflows

### Setup & Development
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

---

## 4. Common Agent Tasks

### Task 1: Adding a New Wallpaper Pattern
1. Create `src/lib/engine/patterns/[name].ts`. Implement the `WallpaperPattern` interface.
2. Export and register the pattern in `src/lib/engine/index.ts`.
3. Add a visual preview snapshot or icon in `src/components/generator/PatternPicker.tsx`.
4. Verify by running `npm run dev` and testing preview and 4K export.

### Task 2: Modifying Landing Page Sections
1. Work within `src/components/landing/`.
2. Ensure sections maintain a minimalist aesthetic (ample whitespace, dark/light contrast, crisp typography).
3. Ensure the "Buy Me a Coffee" CTA remains present in both header/footer and hero area.

### Task 3: Adding Device Resolution Presets
1. Open `src/lib/devices.ts`.
2. Add the new preset entry (e.g., `ULTRAWIDE_5K` or `FOLDABLE_MOBILE`) specifying `name`, `width`, `height`, and `aspectRatio`.

---

## 5. Agent Skills

### Issue Tracker
Local markdown issue tracker under `.scratch/`. See [docs/agents/issue-tracker.md](file:///c:/Users/Denzel/Desktop/Vibe%20code/wallogen/docs/agents/issue-tracker.md).

### Domain Docs
Single-context layout ([PRD.md](file:///c:/Users/Denzel/Desktop/Vibe%20code/wallogen/PRD.md), [ARCHITECTURE.md](file:///c:/Users/Denzel/Desktop/Vibe%20code/wallogen/ARCHITECTURE.md), and `docs/adr/`). See [docs/agents/domain.md](file:///c:/Users/Denzel/Desktop/Vibe%20code/wallogen/docs/agents/domain.md).

