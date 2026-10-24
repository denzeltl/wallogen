"use client";

import React, { useState } from "react";
import { Palette } from "@/types";
import { CURATED_PALETTES, generateRandomCustomPalette, getRandomPalette } from "@/lib/palettes";
import { Check, Dices, Shuffle } from "lucide-react";

interface PaletteSelectorProps {
    selectedPalette: Palette;
    onSelectPalette: (palette: Palette) => void;
}

type FilterMode = "all" | "dark" | "light";

const FILTERS: { id: FilterMode; label: string }[] = [
    { id: "all", label: "All" },
    { id: "dark", label: "Dark" },
    { id: "light", label: "Light" },
];

/** A palette drawn as a tiny wallpaper: its background with the colours as stacked bands. */
const PaletteThumb: React.FC<{ palette: Palette }> = ({ palette }) => (
    <span
        aria-hidden="true"
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg"
        style={{ backgroundColor: palette.background }}
    >
        {palette.colors.slice(0, 4).map((color, i) => (
            <span
                key={i}
                className="absolute inset-x-0 bottom-0 rounded-t-[40%]"
                style={{ backgroundColor: color, height: `${70 - i * 15}%`, left: `${-10 + i * 6}%`, right: `${-10 + (3 - i) * 6}%` }}
            />
        ))}
    </span>
);

export const PaletteSelector: React.FC<PaletteSelectorProps> = ({ selectedPalette, onSelectPalette }) => {
    const [filterMode, setFilterMode] = useState<FilterMode>("all");
    const modeFilter = filterMode === "all" ? undefined : filterMode;

    const filteredPalettes = CURATED_PALETTES.filter((p) => filterMode === "all" || p.mode === filterMode);
    const isCurated = CURATED_PALETTES.some((p) => p.id === selectedPalette.id);

    const handleColorChange = (index: number, newColor: string) => {
        const edited =
            index === -1
                ? { ...selectedPalette, background: newColor }
                : { ...selectedPalette, colors: selectedPalette.colors.map((c, i) => (i === index ? newColor : c)) };
        onSelectPalette({ ...edited, id: `custom_${Date.now()}`, name: "Custom palette" });
    };

    const swatches = [
        { label: "Background", color: selectedPalette.background, index: -1 },
        ...selectedPalette.colors.map((color, index) => ({ label: `Colour ${index + 1}`, color, index })),
    ];

    return (
        <div className="space-y-5">
            {/* Active palette: every swatch is a colour picker */}
            <section aria-labelledby="active-palette-heading" className="space-y-2">
                <div className="flex items-baseline justify-between gap-3">
                    <h3 id="active-palette-heading" className="min-w-0 truncate text-sm font-semibold text-white">
                        {selectedPalette.name}
                    </h3>
                    <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                        Tap a colour to edit
                    </span>
                </div>
                <div className="flex h-14 overflow-hidden rounded-xl border border-zinc-800">
                    {swatches.map((swatch) => (
                        <label
                            key={swatch.index}
                            title={`${swatch.label}: ${swatch.color}`}
                            className={`group relative cursor-pointer transition-[flex-grow] duration-200 focus-within:z-10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-white ${
                                swatch.index === -1 ? "flex-[1.6]" : "flex-1 [@media(hover:hover)]:hover:flex-[1.5]"
                            }`}
                            style={{ backgroundColor: swatch.color }}
                        >
                            <input
                                type="color"
                                value={swatch.color}
                                aria-label={`Edit ${swatch.label.toLowerCase()}`}
                                onChange={(e) => handleColorChange(swatch.index, e.target.value)}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            />
                            {swatch.index === -1 && (
                                <span className="pointer-events-none absolute bottom-1 left-1.5 rounded bg-black/40 px-1 font-mono text-[10px] uppercase text-white/90">
                                    BG
                                </span>
                            )}
                        </label>
                    ))}
                </div>
            </section>

            {/* Filter and random actions */}
            <div className="flex items-center justify-between gap-2">
                <div role="group" aria-label="Palette mode" className="flex rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.id}
                            type="button"
                            onClick={() => setFilterMode(filter.id)}
                            aria-pressed={filterMode === filter.id}
                            className={`min-h-[40px] rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
                                filterMode === filter.id ? "bg-zinc-700 text-white" : "text-zinc-400 [@media(hover:hover)]:hover:text-white"
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-1.5">
                    <button
                        type="button"
                        onClick={() => onSelectPalette(getRandomPalette(modeFilter, selectedPalette.id))}
                        aria-label="Pick a random curated palette"
                        title="Random curated palette"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-[transform,color,border-color] duration-150 [@media(hover:hover)]:hover:border-zinc-600 [@media(hover:hover)]:hover:text-white active:scale-[0.94] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                    >
                        <Shuffle className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onSelectPalette(generateRandomCustomPalette(modeFilter))}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm font-medium text-zinc-200 transition-[transform,color,border-color] duration-150 [@media(hover:hover)]:hover:border-zinc-600 [@media(hover:hover)]:hover:text-white active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                    >
                        <Dices className="h-4 w-4 text-accent-400" />
                        New colours
                    </button>
                </div>
            </div>

            {/* Curated palettes */}
            <div className="grid grid-cols-3 gap-x-2.5 gap-y-3">
                {filteredPalettes.map((palette) => {
                    const isSelected = palette.id === selectedPalette.id;
                    return (
                        <button
                            key={palette.id}
                            type="button"
                            onClick={() => onSelectPalette(palette)}
                            aria-pressed={isSelected}
                            className="group flex min-w-0 flex-col gap-1.5 rounded-xl text-left transition-transform duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                        >
                            <span
                                className={`relative block rounded-xl p-0.5 ring-2 transition-[box-shadow] ${
                                    isSelected ? "ring-accent-500" : "ring-transparent [@media(hover:hover)]:group-hover:ring-zinc-600"
                                }`}
                            >
                                <PaletteThumb palette={palette} />
                                {isSelected && (
                                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-zinc-950">
                                        <Check className="h-3 w-3" strokeWidth={3} />
                                    </span>
                                )}
                            </span>
                            <span className={`truncate px-0.5 text-xs ${isSelected ? "font-semibold text-white" : "text-zinc-400"}`}>
                                {palette.name}
                            </span>
                        </button>
                    );
                })}
            </div>

            {!isCurated && (
                <p className="text-xs text-zinc-500">
                    Using a custom palette. Pick any palette above to go back to a preset.
                </p>
            )}
        </div>
    );
};
