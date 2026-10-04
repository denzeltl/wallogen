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
        <div className="w-full md:w-[380px] lg:w-[400px] bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-800/80 flex flex-col h-full max-h-screen overflow-hidden shrink-0">
            {/* Studio Header Bar */}
            <div className="px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/95 backdrop-blur-md z-20 shrink-0">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-sm text-zinc-100 tracking-tight">Wallpaper Generator</h2>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={handleSurpriseMe}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-95"
                        title="Surprise Me: Randomize Pattern, Palette & Parameters"
                    >
                        <Dices className="w-3.5 h-3.5" />
                        <span>Surprise Me</span>
                    </button>
                </div>
            </div>

            {/* Top Segmented Icon Tab Switcher */}
            <div className="px-3 py-2 border-b border-zinc-800/80 bg-zinc-900/40 shrink-0">
                <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800/80 text-xs">
                    <button
                        onClick={() => setActiveTab("patterns")}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all ${
                            activeTab === "patterns"
                                ? "bg-blue-600 text-white shadow-sm font-semibold"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Patterns</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("tuning")}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all ${
                            activeTab === "tuning"
                                ? "bg-blue-600 text-white shadow-sm font-semibold"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                    >
                        <Sliders className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Tuning</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("colors")}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all ${
                            activeTab === "colors"
                                ? "bg-blue-600 text-white shadow-sm font-semibold"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                    >
                        <PaletteIcon className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Colors</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("screen")}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all ${
                            activeTab === "screen"
                                ? "bg-blue-600 text-white shadow-sm font-semibold"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                    >
                        <Monitor className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Screen</span>
                    </button>
                </div>
            </div>

            {/* Tab Panel Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === "patterns" && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                        <PatternPicker selectedPatternId={patternId} onSelectPattern={onSelectPattern} />
                    </div>
                )}

                {activeTab === "tuning" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                                Pattern Parameters
                            </span>
                            <button
                                onClick={handleRandomizeSlidersOnly}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] font-medium border border-zinc-800 transition-all active:scale-95 shadow-sm"
                                title="Randomize unlocked sliders"
                            >
                                <Shuffle className="w-3.5 h-3.5 text-blue-400" />
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
                    <div className="animate-in fade-in duration-200">
                        <PaletteSelector selectedPalette={palette} onSelectPalette={onSelectPalette} />
                    </div>
                )}

                {activeTab === "screen" && (
                    <div className="animate-in fade-in duration-200">
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
            <div className="px-4 py-3 border-t border-zinc-800/80 bg-zinc-950 shrink-0 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-medium">Export Specification</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-blue-400 font-semibold">
                            {exportWidth}×{exportHeight}
                        </span>
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value as "png" | "jpeg")}
                            className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded px-2 py-0.5 font-mono text-xs focus:outline-none"
                        >
                            <option value="png">PNG</option>
                            <option value="jpeg">JPG</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleExportClick}
                    disabled={isExporting}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold text-sm shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                    {isExporting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Rendering {exportWidth}px Wallpaper...</span>
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            <span>Download High-Res Wallpaper</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
