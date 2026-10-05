"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Monitor, Smartphone, Dices, Coffee, Sparkles, Eye, EyeOff, Layers, Check } from "lucide-react";
import { PATTERNS, renderWallpaper } from "@/lib/engine";
import { CURATED_PALETTES } from "@/lib/palettes";
import { DEVICE_PRESETS } from "@/lib/devices";

export const Hero: React.FC = () => {
    const desktopCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const mobileCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const [selectedPatternId, setSelectedPatternId] = useState<string>("waves");
    const [selectedPaletteId, setSelectedPaletteId] = useState<string>("tokyo_night");
    const [seed, setSeed] = useState<number>(42);
    const [showControls, setShowControls] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<"both" | "desktop" | "mobile">("both");

    const activePattern = useMemo(() => {
        return PATTERNS.find((p) => p.id === selectedPatternId) || PATTERNS[0];
    }, [selectedPatternId]);

    const activePalette = useMemo(() => {
        return CURATED_PALETTES.find((p) => p.id === selectedPaletteId) || CURATED_PALETTES[0];
    }, [selectedPaletteId]);

    // Render both Desktop (16:9) & Mobile (9:16) preview canvases simultaneously
    useEffect(() => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        // Desktop Canvas (16:9 Landscape)
        if (desktopCanvasRef.current) {
            const dCtx = desktopCanvasRef.current.getContext("2d");
            if (dCtx) {
                const dw = 960;
                const dh = 540;
                if (desktopCanvasRef.current.width !== dw * dpr || desktopCanvasRef.current.height !== dh * dpr) {
                    desktopCanvasRef.current.width = dw * dpr;
                    desktopCanvasRef.current.height = dh * dpr;
                }
                dCtx.save();
                dCtx.scale(dpr, dpr);
                renderWallpaper(dCtx, dw, dh, activePattern.id, activePalette, {
                    ...activePattern.defaultParams,
                    seed,
                });
                dCtx.restore();
            }
        }

        // Mobile Canvas (9:16 Portrait)
        if (mobileCanvasRef.current) {
            const mCtx = mobileCanvasRef.current.getContext("2d");
            if (mCtx) {
                const mw = 360;
                const mh = 640;
                if (mobileCanvasRef.current.width !== mw * dpr || mobileCanvasRef.current.height !== mh * dpr) {
                    mobileCanvasRef.current.width = mw * dpr;
                    mobileCanvasRef.current.height = mh * dpr;
                }
                mCtx.save();
                mCtx.scale(dpr, dpr);
                renderWallpaper(mCtx, mw, mh, activePattern.id, activePalette, {
                    ...activePattern.defaultParams,
                    seed,
                });
                mCtx.restore();
            }
        }
    }, [activePattern, activePalette, seed, viewMode]);

    const handleShuffle = () => {
        const availablePatterns = PATTERNS.filter((p) => p.id !== selectedPatternId);
        const randomPattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
        const availablePalettes = CURATED_PALETTES.filter((p) => p.id !== selectedPaletteId);
        const randomPalette = availablePalettes[Math.floor(Math.random() * availablePalettes.length)];

        setSelectedPatternId(randomPattern.id);
        setSelectedPaletteId(randomPalette.id);
        setSeed(Math.floor(Math.random() * 99999) + 1);
    };

    return (
        <section className="relative pt-10 pb-20 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center">
            {/* Technical Engine Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-300 bg-zinc-900/90 border border-zinc-800 mb-8 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-semibold text-zinc-200">14 Procedural Engines</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">Native 4K & Mobile HTML5 Canvas</span>
            </div>

            {/* Main Stark Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl text-center leading-[1.08]">
                Minimalist Vector Wallpapers for Every Display.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-zinc-300 max-w-2xl text-center leading-relaxed font-normal">
                Generate razor-sharp minimalist backgrounds for 4K desktop monitors, ultrawide setups, iPhones, and
                Android devices in real time. Zero sign-up, zero ads.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link
                    href="/generate"
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm sm:text-base font-bold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:-translate-y-0.5 transition-all duration-200 ease-out active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 motion-reduce:transform-none"
                >
                    <span>Open Generator</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform duration-200 ease-out motion-reduce:transform-none" />
                </Link>
                <a
                    href="https://buymeacoffee.com/denzeltl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-amber-400 hover:text-amber-300 hover:-translate-y-0.5 transition-all duration-200 ease-out active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 motion-reduce:transform-none"
                >
                    <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 ease-out motion-reduce:transform-none" />
                    <span>Buy Me a Coffee</span>
                </a>
            </div>

            {/* Interactive Dual-Display Studio Preview Playground */}
            <div className="mt-14 w-full max-w-5xl rounded-3xl bg-zinc-900/90 border border-zinc-800/90 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-zinc-700/80">
                {/* Studio Control Header Toolbar */}
                <div className="p-3.5 border-b border-zinc-800/80 bg-zinc-950/90 flex flex-wrap items-center justify-between gap-3 text-xs">
                    {/* Display View Mode Selector Tabs */}
                    <div
                        role="group"
                        aria-label="Screen display mode selector"
                        className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1"
                    >
                        <button
                            onClick={() => setViewMode("both")}
                            aria-pressed={viewMode === "both"}
                            aria-label="View both desktop and mobile screens"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                                viewMode === "both"
                                    ? "bg-cyan-500 text-zinc-950 shadow-sm font-bold"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                            }`}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Dual</span>
                            <span className="hidden sm:inline">&nbsp;Showcase</span>
                        </button>
                        <button
                            onClick={() => setViewMode("desktop")}
                            aria-pressed={viewMode === "desktop"}
                            aria-label="View desktop monitor screen only"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                                viewMode === "desktop"
                                    ? "bg-cyan-500 text-zinc-950 shadow-sm font-bold"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                            }`}
                        >
                            <Monitor className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Desktop 4K</span>
                        </button>
                        <button
                            onClick={() => setViewMode("mobile")}
                            aria-pressed={viewMode === "mobile"}
                            aria-label="View mobile phone screen only"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                                viewMode === "mobile"
                                    ? "bg-cyan-500 text-zinc-950 shadow-sm font-bold"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                            }`}
                        >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Mobile Phone</span>
                        </button>
                    </div>

                    {/* Active Pattern Metadata & Quick Controls */}
                    <div className="flex items-center gap-2.5">
                        <span className="text-zinc-400 font-mono hidden md:inline">
                            {activePattern.name} • {activePalette.name}
                        </span>

                        {/* Overlays Visibility Toggle */}
                        <button
                            onClick={() => setShowControls(!showControls)}
                            aria-label={showControls ? "Hide canvas badges" : "Show canvas badges"}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 hover:border-zinc-700 transition-all active:scale-95"
                        >
                            {showControls ? (
                                <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                            ) : (
                                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            )}
                            <span className="hidden sm:inline">{showControls ? "Hide Badges" : "Show Badges"}</span>
                        </button>

                        {/* Quick Surprise Me Button */}
                        <button
                            onClick={handleShuffle}
                            aria-label="Randomize desktop and mobile live preview"
                            className="group/btn flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 hover:border-cyan-500/40 transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                        >
                            <Dices className="w-4 h-4 text-cyan-400 group-hover/btn:rotate-180 transition-transform duration-500 ease-out" />
                            <span>Surprise Me</span>
                        </button>
                    </div>
                </div>

                {/* Dual Screen Preview Area */}
                <div className="p-6 sm:p-8 bg-zinc-950/80 border-b border-zinc-800/60 flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center justify-items-center">
                        {/* Desktop Screen Mockup Frame */}
                        {(viewMode === "both" || viewMode === "desktop") && (
                            <div
                                className={`w-full max-w-2xl transition-all duration-300 ${
                                    viewMode === "both" ? "lg:col-span-8" : "lg:col-span-12 max-w-3xl"
                                }`}
                            >
                                <div className="w-full rounded-2xl bg-zinc-950 p-3 sm:p-4 border-2 border-zinc-800 shadow-2xl relative group">
                                    {/* Desktop Monitor Top Bar & Webcam */}
                                    <div className="flex items-center justify-between px-2 pb-2.5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                                            <Monitor className="w-3 h-3 text-cyan-400" />
                                            <span>Desktop 4K (16:9)</span>
                                        </div>
                                    </div>

                                    {/* Desktop 16:9 Canvas */}
                                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-zinc-900 shadow-inner">
                                        <canvas
                                            ref={desktopCanvasRef}
                                            role="img"
                                            aria-label={`Desktop live preview for ${activePattern.name}`}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                                        />

                                        {showControls && (
                                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-zinc-950/85 border border-zinc-800 text-[10px] font-mono text-cyan-400 backdrop-blur-md">
                                                3840×2160 (4K UHD)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile Smartphone Mockup Frame */}
                        {(viewMode === "both" || viewMode === "mobile") && (
                            <div
                                className={`transition-all duration-300 ${
                                    viewMode === "both" ? "lg:col-span-4" : "lg:col-span-12"
                                }`}
                            >
                                <div className="w-56 sm:w-64 rounded-[36px] bg-zinc-950 p-3 border-4 border-zinc-800 shadow-2xl relative group">
                                    {/* Dynamic Island / Notch Pill */}
                                    <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-zinc-900 rounded-full z-20 border border-zinc-800 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-zinc-950 ml-auto mr-1.5" />
                                    </div>

                                    {/* Mobile 9:16 Portrait Canvas */}
                                    <div className="relative aspect-[9/18] w-full rounded-[28px] overflow-hidden bg-black border border-zinc-900 shadow-inner">
                                        <canvas
                                            ref={mobileCanvasRef}
                                            role="img"
                                            aria-label={`Mobile live preview for ${activePattern.name}`}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                                        />

                                        {showControls && (
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-zinc-950/85 border border-zinc-800 text-[10px] font-mono text-zinc-300 backdrop-blur-md whitespace-nowrap">
                                                1170×2532 (Mobile)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pattern Strip Controls at Bottom */}
                <div className="p-4 bg-zinc-950/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
                        <span className="text-zinc-400 font-mono text-[11px] mr-1 hidden md:inline">Styles:</span>
                        {PATTERNS.slice(0, 6).map((pattern) => {
                            const isSelected = pattern.id === selectedPatternId;
                            return (
                                <button
                                    key={pattern.id}
                                    onClick={() => setSelectedPatternId(pattern.id)}
                                    aria-label={`Select ${pattern.name} wallpaper pattern`}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium font-mono transition-all whitespace-nowrap ${
                                        isSelected
                                            ? "bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/30"
                                            : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800"
                                    }`}
                                >
                                    {pattern.name}
                                </button>
                            );
                        })}
                    </div>

                    <Link
                        href="/generate"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition-colors whitespace-nowrap"
                    >
                        <span>Launch Generator</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
};
