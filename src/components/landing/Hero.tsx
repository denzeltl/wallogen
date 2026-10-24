"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Dices, Sparkles } from "lucide-react";
import { PATTERNS, renderWallpaper } from "@/lib/engine";
import { CURATED_PALETTES } from "@/lib/palettes";
import { PromptForm, useLaunchPrompt } from "./PromptForm";

// The styles offered in the hero dock: a spread of looks that read well behind large type.
const HERO_PATTERN_IDS = ["waves", "aurora", "meshGradients", "origamiPeaks", "lightRays", "topography"];
const HERO_PALETTE_IDS = ["tokyo_night", "deep_space", "dracula_neon", "nord_dark", "pastel_sunset", "matcha_latte"];

const HERO_EXAMPLES = ["calm ocean at dusk", "neon tokyo in the rain", "snowy peaks at sunrise", "soft pastel haze"];

// Hero canvases render at CSS size with a capped pixel ratio; the generator handles full-resolution export.
const MAX_HERO_DPR = 1.5;

type Tone = "dark" | "light";

// Behind the copy and dock, and behind the transparent header.
const COPY_REGION = { top: 0.25, bottom: 1, right: 0.65 };
const HEADER_REGION = { top: 0, bottom: 0.08, right: 1 };

/**
 * Average luminance of a region of the wallpaper (fractions of the canvas), sampled on a coarse grid.
 * Light regions get dark text so the copy stays legible.
 */
function measureTone(canvas: HTMLCanvasElement, region: { top: number; bottom: number; right: number }): Tone {
    const ctx = canvas.getContext("2d");
    if (!ctx) return "dark";
    const x0 = 0;
    const y0 = Math.floor(canvas.height * region.top);
    const w = Math.max(1, Math.floor(canvas.width * region.right));
    const h = Math.max(1, Math.floor(canvas.height * region.bottom) - y0);
    const data = ctx.getImageData(x0, y0, w, h).data;
    const step = Math.max(1, Math.floor(Math.sqrt((w * h) / 900)));
    let total = 0;
    let count = 0;
    for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
            const i = (y * w + x) * 4;
            total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
            count++;
        }
    }
    return total / count / 255 > 0.58 ? "light" : "dark";
}

export const Hero: React.FC = () => {
    const canvasA = useRef<HTMLCanvasElement | null>(null);
    const canvasB = useRef<HTMLCanvasElement | null>(null);
    const [front, setFront] = useState(0);
    const [patternId, setPatternId] = useState("waves");
    const [paletteId, setPaletteId] = useState("tokyo_night");
    const [seed, setSeed] = useState(42);
    const frontRef = useRef(0);
    const [tone, setTone] = useState<Tone>("dark");
    const [headerTone, setHeaderTone] = useState<Tone>("dark");
    const firstPaint = useRef(true);
    const launchPrompt = useLaunchPrompt();

    const canvasRefs = useMemo(() => [canvasA, canvasB], []);
    const heroPatterns = useMemo(
        () =>
            HERO_PATTERN_IDS.map((id) => PATTERNS.find((p) => p.id === id)).filter(
                (p): p is NonNullable<typeof p> => Boolean(p)
            ),
        []
    );
    const pattern = PATTERNS.find((p) => p.id === patternId) ?? PATTERNS[0];
    const palette = CURATED_PALETTES.find((p) => p.id === paletteId) ?? CURATED_PALETTES[0];

    const paint = useCallback(
        (canvas: HTMLCanvasElement) => {
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const dpr = Math.min(window.devicePixelRatio || 1, MAX_HERO_DPR);
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            if (!w || !h) return;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.save();
            ctx.scale(dpr, dpr);
            renderWallpaper(ctx, w, h, pattern.id, palette, { ...pattern.defaultParams, seed });
            ctx.restore();
            setTone(measureTone(canvas, COPY_REGION));
            setHeaderTone(measureTone(canvas, HEADER_REGION));
        },
        [pattern, palette, seed]
    );

    // Each change paints the hidden canvas, then crossfades it to the front.
    useEffect(() => {
        if (firstPaint.current) {
            firstPaint.current = false;
            if (canvasA.current) paint(canvasA.current);
            return;
        }
        const back = 1 - frontRef.current;
        const canvas = canvasRefs[back].current;
        if (canvas) paint(canvas);
        frontRef.current = back;
        setFront(back);
    }, [paint, canvasRefs]);

    useEffect(() => {
        let frame = 0;
        const onResize = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const canvas = canvasRefs[front].current;
                if (canvas) paint(canvas);
            });
        };
        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", onResize);
        };
    }, [front, paint, canvasRefs]);

    // Shared with the header, which sits transparent over the hero.
    useEffect(() => {
        document.documentElement.dataset.heroTone = headerTone;
    }, [headerTone]);
    useEffect(() => () => {
        delete document.documentElement.dataset.heroTone;
    }, []);

    const handleShuffle = () => {
        const nextPatterns = heroPatterns.filter((p) => p.id !== patternId);
        const nextPalettes = HERO_PALETTE_IDS.filter((id) => id !== paletteId);
        setPatternId(nextPatterns[Math.floor(Math.random() * nextPatterns.length)].id);
        setPaletteId(nextPalettes[Math.floor(Math.random() * nextPalettes.length)]);
        setSeed(Math.floor(Math.random() * 99999) + 1);
    };

    const generatorHref = `/generate?pattern=${pattern.id}&palette=${palette.id}&seed=${seed}`;

    return (
        <section
            aria-labelledby="hero-heading"
            data-tone={tone}
            className="hero-scope relative -mt-16 min-h-[100dvh] flex flex-col justify-end overflow-hidden"
        >
            {/* The wallpaper itself */}
            <div className="absolute inset-0" aria-hidden="true">
                {canvasRefs.map((ref, i) => (
                    <canvas
                        key={i}
                        ref={ref}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-out motion-reduce:duration-150 ${
                            front === i ? "opacity-100" : "opacity-0"
                        }`}
                    />
                ))}
            </div>
            <div
                aria-hidden="true"
                className={`absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.6)_0%,rgba(9,9,11,0)_22%,rgba(9,9,11,0.1)_40%,rgba(9,9,11,0.9)_100%)] transition-opacity duration-700 ${
                    tone === "light" ? "opacity-0" : "opacity-100"
                }`}
            />
            <div
                aria-hidden="true"
                className={`absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0.15)_45%,rgba(255,255,255,0.7)_100%)] transition-opacity duration-700 ${
                    tone === "light" ? "opacity-100" : "opacity-0"
                }`}
            />

            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-6 sm:pb-8">
                <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-200 hero-ink-2">
                    <Sparkles className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
                    AI wallpaper generator · 4K &amp; mobile
                </p>
                <h1
                    id="hero-heading"
                    className="mt-4 max-w-4xl hero-ink font-display font-extrabold text-white text-[clamp(2.5rem,6.4vw,6.5rem)] leading-[0.92] tracking-[-0.05em]"
                >
                    Describe a wallpaper. Watch it draw itself.
                </h1>
                <p className="mt-5 sm:mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-zinc-200 hero-ink-2">
                    Type a scene in plain words and AI picks the pattern, colours and settings from 18 procedural
                    engines. Download it at your screen&apos;s exact resolution, up to 8K. Free, no sign-up.
                </p>

                <div className="mt-7 sm:mt-8">
                    <PromptForm id="hero-prompt" />
                    <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap" aria-label="Example descriptions">
                        {HERO_EXAMPLES.map((example) => (
                            <button
                                key={example}
                                type="button"
                                onClick={() => launchPrompt(example)}
                                className="hero-glass shrink-0 min-h-[40px] rounded-full border border-white/15 bg-zinc-950/45 px-4 text-sm text-zinc-200 backdrop-blur-md transition-[transform,border-color,color] duration-150 [@media(hover:hover)]:hover:border-white/40 [@media(hover:hover)]:hover:text-white active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transform-none"
                            >
                                &ldquo;{example}&rdquo;
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-row">
                    <Link
                        href={generatorHref}
                        className="hero-solid group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white whitespace-nowrap px-4 sm:px-6 text-sm sm:text-base font-semibold text-zinc-950 transition-[transform,background-color] duration-150 [@media(hover:hover)]:hover:bg-zinc-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 motion-reduce:transform-none"
                    >
                        <span className="sm:hidden">Open in generator</span>
                        <span className="hidden sm:inline">Open this one in the generator</span>
                        <ArrowRight className="hidden sm:block h-4 w-4 shrink-0 transition-transform duration-200 ease-out [@media(hover:hover)]:group-hover:translate-x-1 motion-reduce:transform-none" />
                    </Link>
                    <button
                        type="button"
                        onClick={handleShuffle}
                        className="hero-glass group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/40 bg-zinc-950/45 px-5 sm:px-6 text-sm sm:text-base font-semibold text-white backdrop-blur-md transition-[transform,border-color,background-color] duration-150 [@media(hover:hover)]:hover:border-white [@media(hover:hover)]:hover:bg-zinc-950/70 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transform-none"
                    >
                        <Dices className="h-5 w-5 shrink-0 transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:rotate-180 motion-reduce:transform-none" />
                        Shuffle
                    </button>
                </div>

                {/* Dock: switch style and read what's on screen */}
                <div className="mt-8 sm:mt-10 flex flex-col gap-3 md:flex-row md:items-center">
                    <div
                        role="group"
                        aria-label="Wallpaper style"
                        className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0 md:flex-wrap"
                    >
                        {heroPatterns.map((p) => {
                            const active = p.id === patternId;
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setPatternId(p.id)}
                                    aria-pressed={active}
                                    className={`shrink-0 min-h-[44px] rounded-full border px-4 text-sm font-medium backdrop-blur-md transition-[transform,background-color,color,border-color] duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transform-none ${
                                        active
                                            ? "hero-solid border-white bg-white text-zinc-950"
                                            : "hero-glass border-white/15 bg-zinc-950/45 text-zinc-200 [@media(hover:hover)]:hover:border-white/40 [@media(hover:hover)]:hover:text-white"
                                    }`}
                                >
                                    {p.name}
                                </button>
                            );
                        })}
                    </div>
                    <p
                        aria-live="polite"
                        className="hero-ink-2 md:ml-auto font-mono text-xs uppercase tracking-wider text-zinc-300 tabular-nums"
                    >
                        {pattern.name} · {palette.name} · seed {seed}
                    </p>
                </div>
            </div>
        </section>
    );
};
