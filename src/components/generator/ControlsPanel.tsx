"use client";

import React, { useState } from "react";
import { Palette, PatternParams } from "@/types";
import { PATTERNS, getPatternById } from "@/lib/engine";
import { getRandomPalette } from "@/lib/palettes";
import { PatternPicker } from "./PatternPicker";
import { PaletteSelector } from "./PaletteSelector";
import { ResolutionPicker } from "./ResolutionPicker";
import { Slider } from "@/components/ui/Slider";
import { Download, RotateCcw, Dices, Shuffle, Layers, Sliders, Palette as PaletteIcon, Monitor } from "lucide-react";
import confetti from "canvas-confetti";

interface ControlsPanelProps {
    patternId: string;
    palette: Palette;
    params: PatternParams;
    selectedPresetId: string;
    customWidth: number;
    customHeight: number;
    exportWidth: number;
    exportHeight: number;
    onSelectPattern: (id: string) => void;
    onSelectPalette: (palette: Palette) => void;
    onSelectPreset: (presetId: string) => void;
    onChangeCustomDimensions: (w: number, h: number) => void;
    onChangeParams: (newParams: PatternParams) => void;
    onExport: (format: "png" | "jpeg") => Promise<void>;
}

type TabType = "patterns" | "tuning" | "colors" | "screen";

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
    patternId,
    palette,
    params,
    selectedPresetId,
    customWidth,
    customHeight,
    exportWidth,
    exportHeight,
    onSelectPattern,
    onSelectPalette,
    onSelectPreset,
    onChangeCustomDimensions,
    onChangeParams,
    onExport,
}) => {
    const [activeTab, setActiveTab] = useState<TabType>("patterns");
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState<"png" | "jpeg">("png");

    // Parameter locking state map
    const [lockedParams, setLockedParams] = useState<Record<keyof PatternParams, boolean>>({
        seed: false,
        scale: false,
        density: false,
        complexity: false,
        noiseIntensity: false,
        rotation: false,
        customOptions: false,
    });

    const toggleParamLock = (key: keyof PatternParams) => {
        setLockedParams((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const setParam = (key: keyof PatternParams, value: number) => {
        onChangeParams({ ...params, [key]: value });
    };

    // Randomize ONLY the input sliders (skipping locked parameters)
    const handleRandomizeSlidersOnly = () => {
        onChangeParams({
            seed: lockedParams.seed ? params.seed : Math.floor(Math.random() * 99999) + 1,
            scale: lockedParams.scale ? params.scale : Number((0.5 + Math.random() * 1.8).toFixed(1)),
            density: lockedParams.density ? params.density : Math.floor(4 + Math.random() * 26),
            complexity: lockedParams.complexity ? params.complexity : Math.floor(1 + Math.random() * 8),
            noiseIntensity: lockedParams.noiseIntensity
                ? params.noiseIntensity
                : Number((0.01 + Math.random() * 0.15).toFixed(2)),
            rotation: lockedParams.rotation ? params.rotation : Math.floor(Math.random() * 24) * 15,
        });
    };

    // Randomize EVERYTHING (excluding current pattern and palette to prevent duplicate consecutive picks)
    const handleSurpriseMe = () => {
        const availablePatterns = PATTERNS.filter((p) => p.id !== patternId);
        const p = availablePatterns[Math.floor(Math.random() * availablePatterns.length)] || PATTERNS[0];
        const pal = getRandomPalette(undefined, palette.id);

        onSelectPattern(p.id);
        onSelectPalette(pal);
        onChangeParams({
            seed: lockedParams.seed ? params.seed : Math.floor(Math.random() * 99999) + 1,
            scale: lockedParams.scale ? params.scale : Number((0.5 + Math.random() * 1.5).toFixed(1)),
            density: lockedParams.density ? params.density : Math.floor(4 + Math.random() * 16),
            complexity: lockedParams.complexity ? params.complexity : Math.floor(2 + Math.random() * 6),
            noiseIntensity: lockedParams.noiseIntensity
                ? params.noiseIntensity
                : Number((0.02 + Math.random() * 0.12).toFixed(2)),
            rotation: lockedParams.rotation ? params.rotation : Math.floor(Math.random() * 24) * 15,
        });
    };

    const handleExportClick = async () => {
        try {
            setIsExporting(true);
            await onExport(exportFormat);
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.8 } });
        } catch (err) {
            console.error("Export failed:", err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="w-full md:w-[380px] lg:w-[400px] bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-800/80 flex flex-col h-auto md:h-full md:max-h-screen shrink-0">
            {/* Studio Header Bar */}
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/95 backdrop-blur-md z-20 shrink-0">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-xs sm:text-sm text-zinc-100 tracking-tight">Wallpaper Generator</h2>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={handleSurpriseMe}
                        aria-label="Surprise Me: Randomize Pattern, Palette & Parameters"
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-400/30 hover:-translate-y-0.5 transition-all duration-200 ease-out active:scale-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 motion-reduce:transform-none"
                        title="Surprise Me: Randomize Pattern, Palette & Parameters"
                    >
                        <Dices className="w-4 h-4 group-hover:rotate-180 group-hover:scale-110 transition-transform duration-500 ease-out motion-reduce:transform-none" />
                        <span>Surprise Me</span>
                    </button>
                </div>
            </div>

            {/* Top Segmented Icon Tab Switcher */}
            <div className="px-3 py-2 border-b border-zinc-800/80 bg-zinc-900/40 shrink-0">
                <div role="tablist" aria-label="Generator controls sections" className="grid grid-cols-4 gap-1 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800/80 text-xs">
                    <button
                        id="tab-patterns"
                        role="tab"
                        aria-selected={activeTab === "patterns"}
                        aria-controls="tabpanel-patterns"
                        onClick={() => setActiveTab("patterns")}
                        className={`group flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px] rounded-lg font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                            activeTab === "patterns"
                                ? "bg-cyan-500 text-zinc-950 shadow-sm font-bold"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200 motion-reduce:transform-none" />
                        <span className="text-[11px] sm:text-xs">Patterns</span>
                    </button>

                    <button
                        id="tab-tuning"
                        role="tab"
                        aria-selected={activeTab === "tuning"}
                        aria-controls="tabpanel-tuning"
                        onClick={() => setActiveTab("tuning")}
                        className={`group flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px] rounded-lg font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                            activeTab === "tuning"
                                ? "bg-cyan-500 text-zinc-950 shadow-sm font-bold"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                    >
                        <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200 motion-reduce:transform-none" />
                        <span className="text-[11px] sm:text-xs">Tuning</span>
                    </button>

                    <button
                        id="tab-colors"
                        role="tab"
                        aria-selected={activeTab === "colors"}
                        aria-controls="tabpanel-colors"
                        onClick={() => setActiveTab("colors")}
                        className={`group flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px] rounded-lg font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                            activeTab === "colors"
                                ? "bg-cyan-500 text-zinc-950 shadow-sm font-bold"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                    >
                        <PaletteIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 motion-reduce:transform-none" />
                        <span className="text-[11px] sm:text-xs">Colors</span>
                    </button>

                    <button
                        id="tab-screen"
                        role="tab"
                        aria-selected={activeTab === "screen"}
                        aria-controls="tabpanel-screen"
                        onClick={() => setActiveTab("screen")}
                        className={`group flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px] rounded-lg font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                            activeTab === "screen"
                                ? "bg-cyan-500 text-zinc-950 shadow-sm font-bold"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                    >
                        <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200 motion-reduce:transform-none" />
                        <span className="text-[11px] sm:text-xs">Screen</span>
                    </button>
                </div>
            </div>

            {/* Tab Panel Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === "patterns" && (
                    <div id="tabpanel-patterns" role="tabpanel" aria-labelledby="tab-patterns" className="space-y-3 animate-in fade-in duration-200">
                        <PatternPicker selectedPatternId={patternId} onSelectPattern={onSelectPattern} />
                    </div>
                )}

                {activeTab === "tuning" && (
                    <div id="tabpanel-tuning" role="tabpanel" aria-labelledby="tab-tuning" className="space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                Pattern Parameters
                            </span>
                            <button
                                onClick={handleRandomizeSlidersOnly}
                                aria-label="Randomize unlocked sliders"
                                className="group flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-800 hover:border-cyan-500/30 transition-all duration-200 active:scale-95 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 motion-reduce:transform-none"
                                title="Randomize unlocked sliders"
                            >
                                <Shuffle className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-180 transition-transform duration-500 ease-out motion-reduce:transform-none" />
                                <span>Randomize</span>
                            </button>
                        </div>

                        <div className="space-y-4 pt-1">
                            <Slider
                                label="Seed"
                                value={params.seed}
                                min={1}
                                max={99999}
                                step={1}
                                displayValue={String(params.seed)}
                                isLocked={lockedParams.seed}
                                onToggleLock={() => toggleParamLock("seed")}
                                onChange={(v) => setParam("seed", Math.floor(v))}
                            />
                            <Slider
                                label="Scale"
                                value={params.scale}
                                min={0.4}
                                max={3.0}
                                step={0.1}
                                displayValue={`${params.scale.toFixed(1)}x`}
                                isLocked={lockedParams.scale}
                                onToggleLock={() => toggleParamLock("scale")}
                                onChange={(v) => setParam("scale", v)}
                            />
                            <Slider
                                label="Density / Elements"
                                value={params.density}
                                min={2}
                                max={40}
                                step={1}
                                displayValue={String(params.density)}
                                isLocked={lockedParams.density}
                                onToggleLock={() => toggleParamLock("density")}
                                onChange={(v) => setParam("density", Math.floor(v))}
                            />
                            <Slider
                                label="Complexity"
                                value={params.complexity}
                                min={1}
                                max={10}
                                step={1}
                                displayValue={String(params.complexity)}
                                isLocked={lockedParams.complexity}
                                onToggleLock={() => toggleParamLock("complexity")}
                                onChange={(v) => setParam("complexity", Math.floor(v))}
                            />
                            <Slider
                                label="Film Grain Noise"
                                value={params.noiseIntensity}
                                min={0}
                                max={0.3}
                                step={0.01}
                                displayValue={`${Math.round(params.noiseIntensity * 100)}%`}
                                isLocked={lockedParams.noiseIntensity}
                                onToggleLock={() => toggleParamLock("noiseIntensity")}
                                onChange={(v) => setParam("noiseIntensity", v)}
                            />
                            <Slider
                                label="Angle / Rotation"
                                value={params.rotation}
                                min={0}
                                max={360}
                                step={15}
                                displayValue={`${params.rotation}°`}
                                isLocked={lockedParams.rotation}
                                onToggleLock={() => toggleParamLock("rotation")}
                                onChange={(v) => setParam("rotation", Math.floor(v))}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "colors" && (
                    <div id="tabpanel-colors" role="tabpanel" aria-labelledby="tab-colors" className="animate-in fade-in duration-200">
                        <PaletteSelector selectedPalette={palette} onSelectPalette={onSelectPalette} />
                    </div>
                )}

                {activeTab === "screen" && (
                    <div id="tabpanel-screen" role="tabpanel" aria-labelledby="tab-screen" className="animate-in fade-in duration-200">
                        <ResolutionPicker
                            selectedPresetId={selectedPresetId}
                            customWidth={customWidth}
                            customHeight={customHeight}
                            onSelectPreset={onSelectPreset}
                            onChangeCustomDimensions={onChangeCustomDimensions}
                        />
                    </div>
                )}
            </div>

            {/* Sticky Export Footer */}
            <div className="sticky md:relative bottom-0 z-30 px-4 py-3 border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md shrink-0 space-y-2.5 shadow-2xl md:shadow-none">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium">Export Specification</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 font-semibold">
                            {exportWidth}×{exportHeight}
                        </span>
                        <select
                            value={exportFormat}
                            aria-label="Export image format"
                            onChange={(e) => setExportFormat(e.target.value as "png" | "jpeg")}
                            className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-2.5 py-1 font-mono text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors cursor-pointer"
                        >
                            <option value="png">PNG</option>
                            <option value="jpeg">JPG</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleExportClick}
                    disabled={isExporting}
                    className="group w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 text-zinc-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all duration-200 ease-out active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 motion-reduce:transform-none"
                >
                    {isExporting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                            <span>Rendering {exportWidth}px Wallpaper...</span>
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200 ease-out motion-reduce:transform-none" />
                            <span>Download High-Res Wallpaper</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
