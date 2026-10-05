"use client";

import React from "react";
import { PATTERNS } from "@/lib/engine";
import {
    Layers,
    Sparkles,
    Compass,
    CircleDot,
    Mountain,
    Shapes,
    Wind,
    Cloudy,
    Grid,
    Spline,
    Grid3X3,
    Disc,
    SunMedium,
    Sparkle,
    Shuffle,
    Activity,
    Triangle,
    Square,
    Sun,
} from "lucide-react";

interface PatternPickerProps {
    selectedPatternId: string;
    onSelectPattern: (id: string) => void;
}

const PATTERN_ICONS: Record<string, React.ReactNode> = {
    waves: <Layers className="w-3.5 h-3.5" />,
    gradients: <Sparkles className="w-3.5 h-3.5" />,
    meshGradients: <CircleDot className="w-3.5 h-3.5" />,
    arcs: <Compass className="w-3.5 h-3.5" />,
    topography: <Mountain className="w-3.5 h-3.5" />,
    geometric: <Shapes className="w-3.5 h-3.5" />,
    silkFlow: <Wind className="w-3.5 h-3.5" />,
    noiseFields: <Cloudy className="w-3.5 h-3.5" />,
    voronoi: <Grid className="w-3.5 h-3.5" />,
    stripes: <Spline className="w-3.5 h-3.5" />,
    dotGrid: <Grid3X3 className="w-3.5 h-3.5" />,
    layeredCircles: <Disc className="w-3.5 h-3.5" />,
    aurora: <SunMedium className="w-3.5 h-3.5" />,
    kaleidoscope: <Sparkle className="w-3.5 h-3.5" />,
    origamiPeaks: <Triangle className="w-3.5 h-3.5" />,
    flowField: <Activity className="w-3.5 h-3.5" />,
    glassmorphism: <Square className="w-3.5 h-3.5" />,
    lightRays: <Sun className="w-3.5 h-3.5" />,
};

export const PatternPicker: React.FC<PatternPickerProps> = ({ selectedPatternId, onSelectPattern }) => {
    // Exclude current pattern so random button never selects the same pattern twice consecutively
    const handleRandomPattern = () => {
        const available = PATTERNS.filter((p) => p.id !== selectedPatternId);
        const randomIndex = Math.floor(Math.random() * available.length);
        onSelectPattern(available[randomIndex].id);
    };

    return (
        <div className="space-y-3">
            {/* Uniform Header Bar */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Pattern Styles ({PATTERNS.length})
                </span>
                <button
                    onClick={handleRandomPattern}
                    aria-label="Pick a random pattern style"
                    className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-800 transition-all active:scale-95 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                    title="Pick a random pattern style (different from current)"
                >
                    <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Randomize</span>
                </button>
            </div>

            {/* Uniform Pattern Cards Grid */}
            <div className="grid grid-cols-2 gap-2">
                {PATTERNS.map((pattern) => {
                    const isSelected = pattern.id === selectedPatternId;
                    const icon = PATTERN_ICONS[pattern.id] || <Layers className="w-3.5 h-3.5" />;

                    return (
                        <button
                            key={pattern.id}
                            onClick={() => onSelectPattern(pattern.id)}
                            aria-label={`Select ${pattern.name} pattern style`}
                            className={`flex items-start gap-2.5 p-2.5 min-h-[52px] rounded-xl border text-left transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                                isSelected
                                    ? "bg-cyan-500/15 border-cyan-500/70 text-white shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30"
                                    : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/80 hover:border-zinc-700"
                            }`}
                        >
                            <div
                                className={`p-1.5 rounded-lg mt-0.5 shrink-0 transition-colors ${
                                    isSelected ? "bg-cyan-500 text-zinc-950 shadow-sm font-bold" : "bg-zinc-800 text-zinc-300"
                                }`}
                            >
                                {icon}
                            </div>
                            <div className="overflow-hidden min-w-0">
                                <div className="font-semibold text-xs leading-tight truncate text-zinc-100">
                                    {pattern.name}
                                </div>
                                <div className="text-xs text-zinc-400 mt-0.5 line-clamp-1 leading-tight">
                                    {pattern.description}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
