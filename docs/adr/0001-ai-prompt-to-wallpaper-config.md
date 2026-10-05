# ADR 0001: AI generates wallpaper *configs*, not images

* **Status:** Accepted
* **Date:** 2026-10-06
* **Milestone:** 6 (AI Prompt-to-Wallpaper)

## Context

We want users to describe a wallpaper in plain language and get a result close to their request. The constraint is to use a **free** API, so the plan is Google's Gemini API free tier via a Google AI Studio key.

Wallogen's core promises are:
1. Crisp output at any resolution up to 8K.
2. Deterministic rendering (same seed + palette + params → same pixels).
3. Every result is editable with sliders, palettes and seeds.
4. No server, 100% client-side.

## Options considered

### A. Text-to-image generation (Gemini image / Imagen models)
* Output is a raster at roughly 1K resolution, so 4K/8K export would need upscaling. That breaks promise 1.
* Results can't be edited with the pattern sliders or re-seeded, which breaks promises 2 and 3.
* Free-tier access to image models is limited and has changed often. Per-request cost and latency are much higher.
* Larger content-moderation surface (arbitrary imagery on a public site).

### B. LLM as "art director" → structured config → existing Canvas engine ✅
* A Gemini text model with structured JSON output maps the prompt to `{ patternId, palette, params }` chosen from our own pattern catalog.
* Output is tiny (about 200 tokens), fast, and fits comfortably in free-tier text quotas.
* The result is a normal Wallogen state: 8K-sharp, deterministic, slider-editable, and re-seedable for free.
* Limitation: the result can only be as close to the request as the 14 patterns allow. A prompt like "a cat on the moon" becomes a *mood* (dark, silvery, orbital rings), not a literal cat.

## Decision

Adopt **Option B**.

* The API key must stay secret, so we add a single Next.js Route Handler (`/api/ai/generate`) on Vercel. This is the first server code in the project. Principle 4 is narrowed to: *all rendering is client-side, and the only thing that leaves the browser is the text prompt, sent only when the user uses AI mode.*
* The model is configured via a `GEMINI_MODEL` env var so we can follow Google's free-tier model changes without code edits.
* All model output passes through a pure validator (`src/lib/ai/validate.ts`) before it reaches the engine. The model never controls the seed and never emits code.

## Consequences

* Static hosting (GitHub Pages / `output: 'export'`) no longer supports the AI feature. Vercel (current host) does.
* Free-tier quotas are per key. A popular public site can exhaust them, so we need a rate limit, a friendly "busy" state and a local keyword fallback.
* Under the Gemini API's unpaid-tier terms, Google may use prompts to improve its products. Privacy copy across the site (FAQ, Features, README, llms.txt) must say so and stop claiming that nothing is ever transmitted.
* Prompt quality depends on the catalog descriptions. Adding mood keywords to each pattern improves matching, and new patterns are picked up automatically from the registry.
* Revisit Option A only if a free or cheap image model can produce ≥4K output or vector output.
