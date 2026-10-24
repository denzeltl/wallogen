"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Coffee } from "lucide-react";
import { WallogenLogo } from "@/components/WallogenLogo";
import { CanvasViewport } from "@/components/generator/CanvasViewport";
import { ControlsPanel } from "@/components/generator/ControlsPanel";
import { DEFAULT_PATTERN, PATTERNS, getPatternById } from "@/lib/engine";
import { CURATED_PALETTES, DEFAULT_PALETTE } from "@/lib/palettes";
import { DEVICE_PRESETS, DEFAULT_DEVICE_PRESET } from "@/lib/devices";
import { PatternParams, Palette } from "@/types";
import { exportWallpaper } from "@/lib/engine/exporter";

export default function GeneratorPage() {
    const [patternId, setPatternId] = useState<string>(DEFAULT_PATTERN.id);
    const [palette, setPalette] = useState<Palette>(DEFAULT_PALETTE);
    const [presetId, setPresetId] = useState<string>(DEFAULT_DEVICE_PRESET.id);
    const [customWidth, setCustomWidth] = useState<number>(1920);
    const [customHeight, setCustomHeight] = useState<number>(1080);
    const [isAiGenerating, setIsAiGenerating] = useState(false);

    const [params, setParams] = useState<PatternParams>({
        seed: 42,
        scale: 1.0,
        density: 6,
        complexity: 4,
        noiseIntensity: 0.05,
        rotation: 0,
    });

    // Landing-page links pass ?pattern=&palette=&seed= so the visitor lands on the wallpaper they picked.
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const queryPattern = PATTERNS.find((p) => p.id === query.get("pattern"));
        const queryPalette = CURATED_PALETTES.find((p) => p.id === query.get("palette"));
        const querySeed = Number(query.get("seed"));
        if (queryPattern) {
            setPatternId(queryPattern.id);
            setParams({
                ...queryPattern.defaultParams,
                seed: Number.isInteger(querySeed) && querySeed > 0 ? querySeed : queryPattern.defaultParams.seed,
            });
        }
        if (queryPalette) setPalette(queryPalette);
    }, []);

    const activeDevicePreset = useMemo(() => {
        return DEVICE_PRESETS.find((p) => p.id === presetId) || DEFAULT_DEVICE_PRESET;
    }, [presetId]);

    const targetWidth = presetId === "custom" ? customWidth : activeDevicePreset.width;
    const targetHeight = presetId === "custom" ? customHeight : activeDevicePreset.height;

    const handleSelectPattern = (newPatternId: string) => {
        setPatternId(newPatternId);
        const pObj = getPatternById(newPatternId);
        setParams({
            ...pObj.defaultParams,
            seed: Math.floor(Math.random() * 10000),
        });
    };

    const handleExport = async (format: "png" | "jpeg") => {
        await exportWallpaper({
            patternId,
            palette,
            params,
            width: targetWidth,
            height: targetHeight,
            filename: `wallogen-${patternId}`,
            format,
        });
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:h-screen md:overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b border-zinc-800/80 px-4 flex items-center justify-between bg-zinc-950/90 backdrop-blur-md z-30 shrink-0">
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-1 text-sm font-medium text-zinc-400 transition-colors [@media(hover:hover)]:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                    <div className="h-3.5 w-px bg-zinc-800" />
                    <Link
                        href="/"
                        aria-label="Wallogen home"
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-md px-1 transition-opacity [@media(hover:hover)]:hover:opacity-80 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transform-none"
                    >
                        <WallogenLogo size={24} />
                        <span className="font-display font-extrabold text-base tracking-tight">Wallogen</span>
                    </Link>
                </div>

                <a
                    href="https://buymeacoffee.com/denzeltl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Buy me a coffee"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-zinc-800 px-4 text-sm font-semibold text-amber-400 transition-[transform,border-color] duration-150 [@media(hover:hover)]:hover:border-amber-500/50 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 motion-reduce:transform-none"
                >
                    <Coffee className="w-4 h-4" />
                    <span className="hidden sm:inline">Buy me a coffee</span>
                </a>
            </header>

            {/* Main workspace */}
            <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden min-h-0">
                <CanvasViewport
                    patternId={patternId}
                    palette={palette}
                    params={params}
                    targetWidth={targetWidth}
                    targetHeight={targetHeight}
                    onSelectPreset={setPresetId}
                    isGenerating={isAiGenerating}
                />

                <ControlsPanel
                    patternId={patternId}
                    palette={palette}
                    params={params}
                    selectedPresetId={presetId}
                    customWidth={customWidth}
                    customHeight={customHeight}
                    exportWidth={targetWidth}
                    exportHeight={targetHeight}
                    onSelectPattern={handleSelectPattern}
                    onSelectPalette={setPalette}
                    onSelectPreset={setPresetId}
                    onChangeCustomDimensions={(w, h) => {
                        setCustomWidth(w);
                        setCustomHeight(h);
                    }}
                    onChangeParams={setParams}
                    onExport={handleExport}
                    onAiBusyChange={setIsAiGenerating}
                />
            </main>
        </div>
    );
}
