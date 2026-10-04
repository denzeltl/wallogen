# Wallogen — Design System & Visual Identity

## 1. Aesthetic Thesis & Visual Identity
Wallogen is a precision procedural graphics studio. The visual world is defined by **High-Precision Technical Minimalism**:
- **Pure Typography**: High-contrast, clean sans-serif typography paired with monospaced metadata labels. No text gradients, no artificial glowing borders, no generic AI-slop badges.
- **Surface Hierarchy**: Deep obsidian slate background (`#09090b`) with refined dark graphite card layers (`#121215`), hairline borders (`#27272a`), and sharp 1px grid accents.
- **Interactive First**: The interface recedes to let the live procedural canvas lead from the first viewport.

## 2. Color System
- **Background (Base)**: `#09090b` (`bg-zinc-950`)
- **Surface Layer 1**: `#121215` (`bg-zinc-900/90`)
- **Surface Layer 2**: `#18181b` (`bg-zinc-900`)
- **Borders & Dividers**: `#27272a` (`border-zinc-800`)
- **Primary Accent**: `#2563eb` (`blue-600`), `#3b82f6` (`blue-500`)
- **Support Accent**: `#f59e0b` (`amber-500`) for creator support
- **Foreground Text**: `#ffffff` (Primary), `#a1a1aa` (Secondary metadata), `#71717a` (Muted labels)

## 3. Typography & Spacing
- **Display Headings**: Tracking tight (`tracking-tight`), extra bold (`font-extrabold`), clean white without color gradients.
- **Metadata & Technical Specs**: Font mono (`font-mono`), uppercase tracking wider (`tracking-wider text-xs`).
- **Touch Targets**: Minimum 44×44px interactive bounds across all screen viewports.

## 4. Interaction & Motion Rules
- **Tactile Feedback**: Spring-like press states (`active:scale-[0.97]`).
- **Elevations**: Subtle hover lifts (`hover:-translate-y-0.5`) with focused box shadows (`shadow-blue-500/10`).
- **Reduced Motion**: All spatial transitions respect `prefers-reduced-motion: reduce`.
