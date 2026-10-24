"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { PATTERNS, renderWallpaper } from "@/lib/engine";
import { CURATED_PALETTES } from "@/lib/palettes";
import { ArrowRight, Monitor, Smartphone } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

interface ShowcaseItem {
    id: string;
    title: string;
    promptText?: string;
    patternId: string;
    paletteId: string;
    type: "desktop" | "mobile";
    resolution: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
    {
        id: "1",
        title: "Frosted Glass Prism 4K",
        promptText: "translucent frosted glass panels with ambient glow",
        patternId: "glassmorphism",
        paletteId: "pastel_sunset",
        type: "desktop",
        resolution: "4K Desktop (3840×2160)",
    },
    {
        id: "2",
        title: "Volumetric Light Shafts",
        promptText: "misty volumetric light rays through dark atmosphere",
        patternId: "lightRays",
        paletteId: "deep_space",
        type: "desktop",
        resolution: "4K Desktop (3840×2160)",
    },
    {
        id: "3",
        title: "Alpine Origami Peaks",
        promptText: "snowy low-poly mountain peaks at Nordic dawn",
        patternId: "origamiPeaks",
        paletteId: "nord_light",
        type: "desktop",
        resolution: "Ultrawide (5120×1440)",
    },
    {
        id: "4",
        title: "Cosmic Quantum Currents",
        promptText: "fluid vector flow field through deep space nebula",
        patternId: "flowField",
        paletteId: "cyberpunk_dark",
        type: "desktop",
        resolution: "QHD (2560×1440)",
    },
    {
        id: "5",
        title: "Soft Mesh Aura",
        promptText: "pastel glowing mesh gradient, soft dreamy blur",
        patternId: "meshGradients",
        paletteId: "tokyo_night",
        type: "desktop",
        resolution: "MacBook Pro (3024×1964)",
    },
    {
        id: "6",
        title: "Arctic Aurora Curtains",
        promptText: "ethereal aurora lights over polar night sky",
        patternId: "aurora",
        paletteId: "dracula_neon",
        type: "desktop",
        resolution: "4K Desktop (3840×2160)",
    },
];

const CanvasCard: React.FC<{ item: ShowcaseItem; index: number }> = ({ item, index }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const pattern = PATTERNS.find((p) => p.id === item.patternId) || PATTERNS[0];
    const palette = CURATED_PALETTES.find((p) => p.id === item.paletteId) || CURATED_PALETTES[0];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        // Uniform screen size for all showcase cards (16:9 aspect-video)
        const w = 480;
        const h = 270;

        canvas.width = w * dpr;
        canvas.height = h * dpr;

        ctx.save();
        ctx.scale(dpr, dpr);
        renderWallpaper(ctx, w, h, pattern.id, palette, pattern.defaultParams);
        ctx.restore();
    }, [item, pattern, palette]);

    const isMobile = item.type === "mobile";

    return (
        <Link
            href={`/generate?pattern=${pattern.id}&palette=${palette.id}`}
            aria-label={`Open ${item.title} in the generator`}
            data-reveal
            style={{ "--reveal-i": index % 3 } as React.CSSProperties}
            className="group rounded-2xl p-4 bg-zinc-900/50 border border-zinc-800/80 [@media(hover:hover)]:hover:border-zinc-600 [@media(hover:hover)]:hover:bg-zinc-900 transition-[border-color,background-color,opacity,transform] duration-300 ease-out active:scale-[0.99] flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
            {/* Uniform 16:9 aspect-video screen container across all cards */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800/80 mb-4 bg-black flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    role="img"
                    aria-label={`Wallpaper swatch for ${item.title}`}
                    className="w-full h-full object-cover [@media(hover:hover)]:group-hover:scale-105 transition-transform duration-500 motion-reduce:transform-none ease-out"
                />
                <div className="absolute top-2.5 right-2.5 font-mono text-[10px] text-zinc-200 bg-zinc-950/85 px-2.5 py-1 rounded-md border border-zinc-800 backdrop-blur-md flex items-center gap-1.5">
                    {isMobile ? (
                        <Smartphone className="w-3 h-3 text-accent-400" />
                    ) : (
                        <Monitor className="w-3 h-3 text-accent-400" />
                    )}
                    <span>{pattern.name}</span>
                </div>
            </div>

            <div className="flex flex-col justify-between gap-2">
                <div>
                    <h3 className="font-display font-bold text-lg tracking-tight text-zinc-100">
                        {item.title}
                    </h3>
                    {item.promptText && (
                        <p className="text-sm text-zinc-400 mt-1">
                            &ldquo;{item.promptText}&rdquo;
                        </p>
                    )}
                </div>
                <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{palette.name}</span>
                    <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-700/50 transition-all whitespace-nowrap">
                        {item.resolution}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export const Gallery: React.FC = () => {
    return (
        <section id="gallery" className="py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-zinc-800/60">
            <SectionHeading
                label="Gallery"
                title="Six prompts, six wallpapers."
                lede="Each card is rendered live on this page. Open one to change its seed, colours or size."
            >
                <Link
                    data-reveal
                    style={{ "--reveal-i": 2 } as React.CSSProperties}
                    href="/generate"
                    className="group inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-zinc-700 px-5 text-sm font-semibold text-white transition-[transform,border-color] duration-150 [@media(hover:hover)]:hover:border-zinc-500 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transform-none"
                >
                    <span>Open generator</span>
                    <ArrowRight className="w-4 h-4 [@media(hover:hover)]:group-hover:translate-x-1 transition-transform motion-reduce:transform-none" />
                </Link>
            </SectionHeading>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SHOWCASE_ITEMS.map((item, i) => (
                    <CanvasCard key={item.id} item={item} index={i} />
                ))}
            </div>
        </section>
    );
};
