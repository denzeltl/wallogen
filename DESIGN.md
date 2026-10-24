# Wallogen — Design System & Visual Identity

## 1. Aesthetic Thesis & Visual Identity
Wallogen is a precision procedural graphics studio. Direction: **The wall is the hero**. The product's own output is the art; the interface is a thin, quiet frame around it.
- **Live wallpaper first**: the landing hero is a full-bleed, live-rendered wallpaper with copy on a dark scrim and a floating dock of style chips. The generator canvas leads its screen the same way.
- **Pure Typography**: tight, heavy display type (Inter Tight) over the wallpaper; Inter for body; JetBrains Mono for small uppercase readouts. No text gradients, no glows, no badges.
- **Surface Hierarchy**: near-black base (`#09090b`), graphite surfaces (`#121215`, `#18181b`), hairline borders (`#27272a`).
- **AI first**: the describe-a-wallpaper field (`PromptForm`) is the hero's main input and has its own section (`AiSection`). Landing prompts hand off to the generator through sessionStorage (`lib/ai/handoff.ts`), never the URL. Shuffle sits beside the main CTA as an equal outline button.
- **Palettes in the generator**: the active palette is an editable strip (each swatch is a colour picker); presets are 3-column mini-wallpaper thumbnails with a ring for the selection.
- **Signature interaction**: picking a style or pressing Shuffle crossfades the whole wallpaper to a new seed (700ms ease-out, 150ms under reduced motion). The mono readout updates to name what's on screen.
- **Motion personality**: calm and cinematic. Things fade and settle; nothing bounces.

## 2. Brand
- **Mark**: "Strata tile". A rounded square holding three stacked wave bands at 35/65/100% opacity whose top edges form a W. Source: `src/components/WallogenLogo.tsx`.
- **Files**: `public/brand/` holds `mark.svg`, `mark-blue.svg` (legacy blue tile), `logo.svg` (dark), `logo-inverse.svg` (for light grounds), `logo-mono.svg`, `icon-192.png`, `icon-512.png`. App icons live in `src/app/` (`icon.svg`, `favicon.ico` 16/32/48, `apple-icon.png`, `opengraph-image.png`, `twitter-image.png`, `manifest.ts`).
- **Minimum size**: 16px. Clear space: a quarter of the mark's width on every side.

## 3. Color System
- **Background (Base)**: `#09090b` (`bg-zinc-950`)
- **Surface Layer 1**: `#121215` (`bg-zinc-900/90`)
- **Surface Layer 2**: `#18181b` (`bg-zinc-900`)
- **Borders & Dividers**: `#27272a` (`border-zinc-800`)
- **Accent**: violet, defined once as RGB channels (`--accent-50`…`--accent-700`) in `globals.css` and exposed as Tailwind `accent-*`. `accent-500` `#a78bfa` for selected states and primary generator actions (dark `zinc-950` text on it), `accent-400` `#c4b5fd` for accent text and icons on dark, `accent-600` `#8b5cf6` for stronger fills.
- **Primary CTA on the landing page**: white pill (`bg-white text-zinc-950`), because it sits on top of any wallpaper colour.
- **Support Accent**: `#f59e0b` (`amber-500`), only for Buy Me a Coffee.
- **Foreground Text**: `#ffffff` primary, `#a1a1aa` secondary, `#71717a` muted labels.

## 4. Typography & Spacing
- **Display** (`font-display`, Inter Tight 800): hero `clamp(2.75rem, 8vw, 8rem)`, leading 0.92, tracking −0.05em. Section h2 `text-4xl/5xl`, tracking −0.04em.
- **Body** (`font-sans`, Inter): 16px minimum, 18px for ledes, measure ≤ `max-w-xl`.
- **Labels & readouts** (`font-mono`, JetBrains Mono): `text-xs uppercase tracking-wider`, `tabular-nums` for changing numbers.
- **Sections**: `py-24 sm:py-32`, `max-w-7xl`, each opens with label → heading → lede (`SectionHeading`).
- **Touch Targets**: minimum 44×44px on every control.

## 5. Interaction & Motion Rules
- **Press**: `active:scale-[0.97]` on buttons, chips and links styled as buttons.
- **Hover**: only under `@media (hover: hover)` (`[@media(hover:hover)]:hover:*`); colour/border changes, no lifts.
- **Focus**: `focus-visible:ring-2` in white (amber for coffee links).
- **Reveals**: landing sections fade up 16px over 600ms with a 70ms reading-order stagger (`data-reveal`, `--reveal-i`). Content is visible without JS.
- **Smooth scroll**: Lenis on the landing page only (`LandingMotion`), never in the generator.
- **Reduced Motion**: Lenis and reveals are off; crossfades shorten to 150ms; transforms are removed via `motion-reduce:transform-none`.
