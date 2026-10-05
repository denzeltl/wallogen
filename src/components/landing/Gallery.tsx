"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { PATTERNS, renderWallpaper } from "@/lib/engine";
import { CURATED_PALETTES } from "@/lib/palettes";
import { ArrowRight, Monitor, Smartphone } from "lucide-react";

interface ShowcaseItem {
    id: string;
    title: string;
    patternId: string;
    paletteId: string;
    type: "desktop" | "mobile";
    resolution: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
    {
        id: "1",
        title: "Ocean Sine Waves",
        patternId: "waves",
        paletteId: "tokyo_night",
        type: "desktop",
        resolution: "4K Desktop (3840×2160)",
    },
    {
        id: "2",
        title: "Aurora Phone Lockscreen",
        patternId: "aurora",
        paletteId: "cyberpunk_dark",
        type: "desktop",
        resolution: "iPhone 15 Pro (1179×2556)",
    },
    {
        id: "3",
        title: "Prism Geometry 4K",
        patternId: "kaleidoscope",
        paletteId: "dracula_neon",
        type: "desktop",
        resolution: "Ultrawide 5K (5120×1440)",
    },
    {
        id: "4",
        title: "Nordic Snow Topography",
        patternId: "topography",
        paletteId: "nord_light",
        type: "desktop",
        resolution: "Android Flagship (1440×3088)",
    },
    {
        id: "5",
        title: "Liquid Silk Flow Field",
        patternId: "silkFlow",
        paletteId: "deep_space",
        type: "desktop",
        resolution: "4K Studio (3840×2160)",
    },
    {
        id: "6",
        title: "Voronoi Phone Background",
        patternId: "voronoi",
        paletteId: "gruvbox_dark",
        type: "desktop",
        resolution: "Mobile Portrait (1080×2400)",
    },
];

const CanvasCard: React.FC<{ item: ShowcaseItem }> = ({ item }) => {
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
            href="/generate"
            aria-label={`Open studio with ${item.title} preset`}
            className="group rounded-2xl p-4 bg-zinc-900/50 border border-zinc-800/80 hover:border-cyan-500/50 hover:bg-zinc-900 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
            {/* Uniform 16:9 aspect-video screen container across all cards */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800/80 mb-4 bg-black flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    role="img"
                    aria-label={`Wallpaper swatch for ${item.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-2.5 right-2.5 font-mono text-[10px] text-zinc-200 bg-zinc-950/85 px-2.5 py-1 rounded-md border border-zinc-800 backdrop-blur-md flex items-center gap-1.5">
                    {isMobile ? (
                        <Smartphone className="w-3 h-3 text-cyan-400" />
                    ) : (
                        <Monitor className="w-3 h-3 text-cyan-400" />
                    )}
                    <span>{pattern.name}</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h3 className="font-bold text-sm text-zinc-100 group-hover:text-cyan-400 transition-colors">
                        {item.title}
                    </h3>
                    <span className="text-xs text-zinc-400 font-mono mt-0.5 block">{palette.name} Palette</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800/80 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 group-hover:border-cyan-500/40 px-2.5 py-1 rounded-md border border-zinc-700/50 transition-all whitespace-nowrap">
                    {item.resolution}
                </span>
            </div>
        </Link>
    );
};

export const Gallery: React.FC = () => {
    return (
        <section id="gallery" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-zinc-800/60">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-2 block">
                        Curated Styles
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Infinite Procedural Variations.
                    </h2>
                </div>

                <Link
                    href="/generate"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 active:scale-95"
                >
                    <span>Open Generator</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SHOWCASE_ITEMS.map((item) => (
                    <CanvasCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
};
