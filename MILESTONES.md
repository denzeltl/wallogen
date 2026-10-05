# Wallogen — Development Milestones & Session Chunks

This document tracks the phased development roadmap for Wallogen. Each milestone represents a self-contained session chunk with concrete deliverables and verification criteria.

---

## 🚩 Milestone 1: App Bootstrapping & Core Project Scaffolding (Chunk 1)
* **Status:** ✅ Completed
* **Goal:** Initialize Next.js (App Router), TypeScript, Tailwind CSS, project layout, and core data types.
* **Deliverables:**
  - [x] Create project structure (`package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs`)
  - [x] Install dependencies (`lucide-react`, `clsx`, `tailwind-merge`, `canvas-confetti`)
  - [x] Global styles & typography in `src/app/globals.css`
  - [x] Core TypeScript definitions (`src/types/index.ts`)
  - [x] Device & Screen Resolution definitions (`src/lib/devices.ts`)
  - [x] Curated Color Palettes database (`src/lib/palettes/index.ts`)

---

## 🚩 Milestone 2: Procedural Canvas Engine & Pattern Renderers (Chunk 2)
* **Status:** ✅ Completed
* **Goal:** Build the client-side HTML5 Canvas 2D engine and core minimalist pattern renderers.
* **Deliverables:**
  - [x] Engine Runner & Plugin Registry (`src/lib/engine/index.ts`)
  - [x] Grain & Procedural Noise overlay post-processor (`src/lib/engine/noise.ts`)
  - [x] 14 procedural pattern renderers (Waves, Gradients, Mesh Aura, Arcs, Topography, Geometric, Silk Flow, Cosmic Noise, Voronoi, Curved Lines, Halftone Grid, Orbital Rings, Aurora Lights, Prism Geometry)

---

## 🚩 Milestone 3: Generator App UI & Interactive Controls (Chunk 3)
* **Status:** ✅ Completed
* **Goal:** Implement the main wallpaper generator application view (`/generate`).
* **Deliverables:**
  - [x] `CanvasViewport.tsx` — Single persistent preview canvas with lockscreen mockups & adaptive text colors
  - [x] `ControlsPanel.tsx` — Top segmented icon tabs (Patterns, Tuning, Colors, Screen) with zero scrolling
  - [x] `Slider.tsx` — Custom range sliders with lock/unlock toggle protection
  - [x] `PatternPicker.tsx` — 14 pattern grid cards + Random Pattern button
  - [x] `PaletteSelector.tsx` — 13 curated palettes + Light/Dark filters + Custom Hex Picker + Random Palette card
  - [x] `ResolutionPicker.tsx` — Target presets (4K Desktop, Ultrawide, iPhone, iPad, Custom px)
  - [x] High-Res Offscreen Exporter — PNG/JPEG export at native target dimensions

---

## 🚩 Milestone 4: Landing Page & Creator Support Showcase (Chunk 4)
* **Status:** ✅ Completed
* **Goal:** Build the marketing landing page (`/`) showcasing features, live preview, and Buy Me a Coffee integration.
* **Deliverables:**
  - [x] `Header` & `Footer` — Minimal navigation bar with direct link to Generator App & Buy Me a Coffee
  - [x] `Hero.tsx` — Tagline, badges, interactive live procedural canvas demo widget
  - [x] `Features.tsx` — Grid detailing 4K/8K support, client-side privacy, pattern engine variety, creator support
  - [x] `Gallery.tsx` — Interactive preset wallpaper showcase grid
  - [x] `FAQ.tsx` — Accessible accordion for common questions
  - [x] `BuyMeACoffee.tsx` — Creator support card with coffee cup badge & CTA

---

## 🚩 Milestone 5: Optimization, SEO & Production Build (Chunk 5)
* **Status:** ✅ Completed
* **Goal:** End-to-end performance tuning, SEO metadata, AI Search optimization (AEO/GEO), and production build verification.
* **Deliverables:**
  - [x] OpenGraph images, Twitter cards, canonical URL, and theme color metadata in `src/app/layout.tsx`
  - [x] JSON-LD `schema.org` WebApplication structured data for Google & AI search engines
  - [x] `public/llms.txt` and `public/llms-full.txt` agent-readable site manifests
  - [x] `src/app/sitemap.ts` dynamic sitemap generator
  - [x] `src/app/robots.ts` crawler rule file for Googlebot, Bingbot, ChatGPT (`OAI-SearchBot`), Perplexity, and Claude

---

## 🚩 Milestone 6: AI Prompt-to-Wallpaper ("Describe it") (Chunk 6)
* **Status:** 🟡 Built and verified offline. The live Gemini call is waiting on a real `GEMINI_API_KEY` test.
* **Goal:** Let users type a description (e.g. *"calm ocean at dusk, very minimal"*) and get a wallpaper that matches it, using Google's free-tier Gemini API.
* **Approach:** Gemini acts as **art director, not painter**. It translates the prompt into a structured wallpaper config (pattern, palette, params), and the existing Canvas engine renders it. The result stays sharp at 8K, deterministic per seed, and editable with every existing slider. See [ADR 0001](docs/adr/0001-ai-prompt-to-wallpaper-config.md).
* **Data flow:**
  ```
  AiPromptBar ─► lib/ai/client.ts ─► POST /api/ai/generate ─► rate limit ─► Gemini (structured JSON)
                      │                                                         │ validate + clamp
                      │◄────────────────────────────────────────────────────────┘
                      ├─ quota used up / busy / offline ─► soft notice + on-device close match (fallback.ts)
                      ▼
         pattern + palette + params state ─► Canvas engine ─► 4K/8K export
  ```
* **Deliverables:**
  - **6.1: Config contract & catalog**
    - [x] `AiWallpaperConfig` / `AiGenerateResponse` types in `src/types/index.ts`
    - [x] Shared `PARAM_RANGES` + `clampParam()` in `src/lib/engine/params.ts`. The Tuning sliders now read their bounds from it.
    - [x] `src/lib/ai/catalog.ts` builds the model-facing catalog from the `PATTERNS` registry plus `PATTERN_MOODS` keywords
    - [x] `src/lib/ai/validate.ts` is pure and never throws. It maps an unknown `patternId` to `meshGradients` and drops invalid hex values, topping colours up from a curated palette. It clamps and snaps params to `PARAM_RANGES` and strips control chars and `<>` from text. The seed is always assigned client-side.
  - **6.2: Server route (the first server code)**
    - [x] `src/app/api/ai/generate/route.ts`, a Node runtime Route Handler. It caps prompts at 200 chars and strips control chars.
    - [x] `src/lib/ai/gemini.ts` uses `@google/genai` with `responseSchema` (enum of pattern IDs), a system prompt containing the catalog and 5 few-shot examples, and a 12 s timeout
    - [x] `GEMINI_API_KEY` (server-only) and `GEMINI_MODEL` (default `gemini-flash-lite-latest`) are documented in `.env.example` and the README
    - [x] Per-IP limit of 5/min and 30/day (`src/lib/ai/rateLimit.ts`, best-effort in memory). A Gemini 429 is classified as `daily_limit` (quota id contains `PerDay`; resets at midnight Pacific) or `busy` (uses Google's `retryDelay`).
  - **6.3: Generator UI**
    - [x] `src/components/generator/AiPromptBar.tsx` sits above the tabs in `ControlsPanel.tsx`, so it is always visible. It has example-prompt chips and a "Designing your wallpaper…" overlay on the canvas.
    - [x] Applying a result sets pattern, palette (custom, named after the AI title) and params, and respects slider locks
    - [x] The result title and one-line rationale are shown in the bar, labelled "AI" or "Close match". **New variation** reseeds locally with no API call, **Reinterpret** calls the API again, and **Undo** restores the wallpaper from before the last generation.
    - [x] **Soft limit messages**, using a calm amber tone (no error red), always shown alongside a usable wallpaper:
      - Daily quota used up: *"Today's free AI wallpapers are all used up. No worries, we styled a close match from your words instead. AI wallpapers come back in about N hours."*
      - Rate-limited: *"The AI is catching its breath…try AI again in about a minute."*
      - Offline / no key: *"The AI is taking a short break. Here's a close match from your words instead."*
    - [x] Cooldown is remembered in `localStorage` (`wallogen.aiCooldown`), so once the quota is used up the app stops calling the API until the reset time
    - [x] On-device keyword fallback (`src/lib/ai/fallback.ts`), so the button always returns a wallpaper
  - **6.4: Honesty, privacy & docs**
    - [x] Updated the privacy copy in `FAQ.tsx` (plus a new AI FAQ entry), `Features.tsx`, `README.md`, `public/llms.txt` and `public/llms-full.txt`
    - [x] Disclosure line under the prompt bar
    - [x] Updated `ARCHITECTURE.md` (§2.5 + directory tree + server note), `ARCHITECTURE-ESSENTIALS.md` principle #1 and the PRD feature list. Marked ADR 0001 Accepted.
  - **6.5: Quality check**
    - [x] `src/lib/ai/__fixtures__/prompts.json` has 20 prompts, including non-English, vague, injection and out-of-range requests
    - [x] Comprehensive automated test suite created with Vitest + React Testing Library (7 test files, 31 tests passing across validator, fallback, rate limiter, client, API route handler, component, and 20 prompt fixtures)
    - [ ] Run the fixtures against live Gemini with a real key and review the visuals
* **Verification:**
  - [x] `npx tsc --noEmit`, `npm run lint` and `npm run build` pass. Gemini code and the system prompt appear only in `.next/server`, not `.next/static`.
  - [x] In the browser (no key): the prompt applies a close match with the soft "short break" notice. The sixth request in a minute returns `429 busy` with `Retry-After`. A simulated daily cooldown shows the daily-limit message without calling the server. (Undo ran without errors, but in that test the before and after wallpapers were identical, so give it a proper manual check.)
  - [ ] With a real key: prompt → preview in under 3 s, and the AI result exports cleanly at 3840×2160 and 7680×4320
* **Out of scope (future):** raw AI image generation, "bring your own API key", a shared rate-limit store (Upstash/Vercel KV) if traffic grows, AI-designed *new* pattern code, image-to-palette (already on PRD roadmap as Palette Extractor).
