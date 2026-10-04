"use client";

import React, { useState } from "react";
import { Palette } from "@/types";
import { CURATED_PALETTES, generateRandomCustomPalette, getRandomPalette } from "@/lib/palettes";
import { Sun, Moon, Shuffle, Check, Pipette, Sparkles } from "lucide-react";

interface PaletteSelectorProps {
    selectedPalette: Palette;
    onSelectPalette: (palette: Palette) => void;
}

export const PaletteSelector: React.FC<PaletteSelectorProps> = ({ selectedPalette, onSelectPalette }) => {
    const [filterMode, setFilterMode] = useState<"all" | "dark" | "light">("all");
    const [showColorEditor, setShowColorEditor] = useState(false);

    const filteredPalettes = CURATED_PALETTES.filter((p) => {
        if (filterMode === "all") return true;
        return p.mode === filterMode;
    });

    // Exclude currently selected palette ID when shuffling
    const handleShuffle = () => {
        const randomP = getRandomPalette(filterMode === "all" ? undefined : filterMode, selectedPalette.id);
        onSelectPalette(randomP);
    };

    const handleRandomPaletteCardClick = () => {
        const freshRandomP = generateRandomCustomPalette(filterMode === "all" ? undefined : filterMode);
        onSelectPalette(freshRandomP);
    };

    const handleColorChange = (index: number, newColor: string) => {
        if (index === -1) {
            onSelectPalette({
                ...selectedPalette,
                id: `custom_${Date.now()}`,
                name: "Custom Palette",
                background: newColor,
            });
        } else {
            const updatedColors = [...selectedPalette.colors];
            updatedColors[index] = newColor;
            onSelectPalette({
                ...selectedPalette,
                id: `custom_${Date.now()}`,
                name: "Custom Palette",
                colors: updatedColors,
            });
        }
    };

    const isRandomSelected = selectedPalette.id.startsWith("random_");

    return (
        <div className="space-y-3">
            {/* Uniform Header Bar */}
            <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Color Palette</span>

        <div className="flex items-center gap-1.5">
          {/* Custom Edit Color Toggle Button */}
          <button
            onClick={() => setShowColorEditor(!showColorEditor)}
            aria-label="Edit custom colors"
            className={`p-2 min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-lg border text-xs transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              showColorEditor
                ? "bg-blue-600/20 border-blue-500 text-blue-400 font-medium"
                : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-zinc-100"
            }`}
            title="Edit Custom Colors"
          >
            <Pipette className="w-4 h-4" />
          </button>

          {/* Light / Dark Mode Segmented Filter */}
          <div role="group" aria-label="Palette mode filter" className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs text-zinc-300">
            <button
              onClick={() => setFilterMode("all")}
              aria-label="Show all palettes"
              aria-pressed={filterMode === "all"}
              className={`px-2.5 py-1.5 min-h-[36px] rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                filterMode === "all" ? "bg-zinc-800 text-white font-medium" : "hover:text-zinc-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode("dark")}
              aria-label="Filter dark mode palettes"
              aria-pressed={filterMode === "dark"}
              className={`p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                filterMode === "dark" ? "bg-zinc-800 text-white" : "hover:text-zinc-100"
              }`}
              title="Dark Mode Palettes"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFilterMode("light")}
              aria-label="Filter light mode palettes"
              aria-pressed={filterMode === "light"}
              className={`p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                filterMode === "light" ? "bg-zinc-800 text-white" : "hover:text-zinc-100"
              }`}
              title="Light Mode Palettes"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
            aria-label="Pick a random palette"
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-800 transition-all active:scale-95 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            title="Pick a random palette (different from current)"
          >
            <Shuffle className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Randomize</span>
          </button>
        </div>
      </div>

      {/* Custom Color Inputs Bar */}
      {showColorEditor && (
        <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2 animate-in fade-in duration-150">
          <div className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
            <span>Customize Active Swatches</span>
            <span className="text-xs text-blue-400 font-mono">{selectedPalette.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-zinc-300 uppercase font-mono mb-1">BG</span>
              <input
                type="color"
                value={selectedPalette.background}
                aria-label="Custom background color"
                onChange={(e) => handleColorChange(-1, e.target.value)}
                className="w-9 h-9 rounded-lg border border-zinc-700 bg-transparent cursor-pointer overflow-hidden p-0"
              />
            </div>
            <div className="h-6 w-px bg-zinc-800 mx-1" />
            {selectedPalette.colors.map((col, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-[10px] text-zinc-300 font-mono mb-1">C{idx + 1}</span>
                <input
                  type="color"
                  value={col}
                  aria-label={`Custom color ${idx + 1}`}
                  onChange={(e) => handleColorChange(idx, e.target.value)}
                  className="w-9 h-9 rounded-lg border border-zinc-700 bg-transparent cursor-pointer overflow-hidden p-0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

            {/* Uniform Palette Swatch Grid */}
            <div className="grid grid-cols-2 gap-2">
                {/* Dynamic Random Palette Generator Card */}
                <button
                    onClick={handleRandomPaletteCardClick}
                    className={`flex flex-col p-2 rounded-xl border text-left transition-all active:scale-[0.98] ${
                        isRandomSelected
                            ? "bg-blue-600/15 border-blue-500/70 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30"
                            : "bg-zinc-900/90 border-blue-500/40 hover:bg-zinc-800/90 hover:border-blue-500/70 text-zinc-200"
                    }`}
                >
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold flex items-center gap-1 text-blue-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Random Palette</span>
                        </span>
                        {isRandomSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    </div>

                    <div className="flex items-center h-3.5 rounded-md overflow-hidden w-full border border-blue-500/30 bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 to-emerald-400" />
                </button>

                {/* Curated Palettes */}
                {filteredPalettes.map((palette) => {
                    const isSelected = palette.id === selectedPalette.id;

                    return (
                        <button
                            key={palette.id}
                            onClick={() => onSelectPalette(palette)}
                            className={`flex flex-col p-2 rounded-xl border text-left transition-all active:scale-[0.98] ${
                                isSelected
                                    ? "bg-blue-600/15 border-blue-500/70 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30"
                                    : "bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-semibold text-zinc-200 truncate">{palette.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                            </div>

                            <div className="flex items-center h-3.5 rounded-md overflow-hidden w-full border border-zinc-800">
                                <div
                                    className="h-full w-1/4"
                                    style={{ backgroundColor: palette.background }}
                                    title="Background"
                                />
                                {palette.colors.slice(0, 3).map((color, idx) => (
                                    <div key={idx} className="h-full flex-1" style={{ backgroundColor: color }} />
                                ))}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
