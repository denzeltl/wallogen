"use client";

import React, { useEffect, useRef } from "react";
import { ArrowUpRight, Lock, Layers, Infinity as InfinityIcon } from "lucide-react";
import { PATTERNS, renderWallpaper } from "@/lib/engine";
import { CURATED_PALETTES } from "@/lib/palettes";
import { SectionHeading } from "./SectionHeading";
import { PromptForm, useLaunchPrompt } from "./PromptForm";

// Example prompts with the kind of style they tend to land on. Clicking one runs the real AI.
const EXAMPLES = [
    { prompt: "misty pine forest at dawn", patternId: "topography", paletteId: "matcha_latte" },
    { prompt: "synthwave sunset over the sea", patternId: "waves", paletteId: "cyberpunk_dark" },
    { prompt: "aurora over arctic snow", patternId: "aurora", paletteId: "deep_space" },
    { prompt: "warm desert dunes, minimal", patternId: "origamiPeaks", paletteId: "sahara_gold" },
];

const POINTS = [
    {
        icon: Layers,
        title: "You get settings, not a flat image",
        body: "The AI chooses an engine, palette and parameters. Your browser draws the result, so it stays sharp at 8K and every slider still works.",
    },
    {
        icon: Lock,
        title: "Only your words leave the browser",
        body: "The description goes to an AI provider (Groq, or Google Gemini as a backup) to pick a style. Rendering and downloads happen on your device.",
    },
    {
        icon: InfinityIcon,
        title: "Never stuck",
        body: "If the free daily AI allowance runs out, Wallogen builds a close match from your words on-device instead.",
    },
];

const ExampleThumb: React.FC<{ patternId: string; paletteId: string }> = ({ patternId, paletteId }) => {
    const ref = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        const pattern = PATTERNS.find((p) => p.id === patternId) ?? PATTERNS[0];
        const palette = CURATED_PALETTES.find((p) => p.id === paletteId) ?? CURATED_PALETTES[0];
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = 160;
        const h = 100;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.save();
        ctx.scale(dpr, dpr);
        renderWallpaper(ctx, w, h, pattern.id, palette, pattern.defaultParams);
        ctx.restore();
    }, [patternId, paletteId]);

    return <canvas ref={ref} aria-hidden="true" className="h-full w-full" />;
};

export const AiSection: React.FC = () => {
    const launch = useLaunchPrompt();

    return (
        <section id="ai" aria-labelledby="ai-heading" className="px-4 sm:px-6 py-24 sm:py-32 max-w-7xl mx-auto">
            <SectionHeading
                label="Describe it with AI"
                title="Write one sentence. Get a wallpaper you can still edit."
                lede="No prompt engineering. Name a place, a mood or a colour, and the AI art director turns it into a wallpaper in a few seconds."
            />

            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
                <div className="min-w-0">
                    <div data-reveal style={{ "--reveal-i": 3 } as React.CSSProperties}>
                        <PromptForm id="ai-section-prompt" placeholder="e.g. rainy city at night" />
                    </div>

                    <p
                        data-reveal
                        style={{ "--reveal-i": 4 } as React.CSSProperties}
                        className="mt-8 font-mono text-xs uppercase tracking-wider text-zinc-500"
                    >
                        Or try one of these
                    </p>
                    <ul className="mt-3 border-t border-zinc-800">
                        {EXAMPLES.map((example, i) => (
                            <li key={example.prompt} data-reveal style={{ "--reveal-i": i + 5 } as React.CSSProperties}>
                                <button
                                    type="button"
                                    onClick={() => launch(example.prompt)}
                                    className="group flex w-full items-center gap-4 border-b border-zinc-800 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                                >
                                    <span className="h-12 w-20 shrink-0 overflow-hidden rounded-md border border-zinc-800 sm:h-14 sm:w-24">
                                        <ExampleThumb patternId={example.patternId} paletteId={example.paletteId} />
                                    </span>
                                    <span className="min-w-0 flex-1 font-display text-lg font-bold tracking-tight text-zinc-200 transition-colors [@media(hover:hover)]:group-hover:text-white sm:text-xl">
                                        &ldquo;{example.prompt}&rdquo;
                                    </span>
                                    <ArrowUpRight className="h-5 w-5 shrink-0 text-zinc-500 transition-[transform,color] duration-200 [@media(hover:hover)]:group-hover:-translate-y-0.5 [@media(hover:hover)]:group-hover:translate-x-0.5 [@media(hover:hover)]:group-hover:text-white motion-reduce:transform-none" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <ul className="flex flex-col gap-8">
                    {POINTS.map((point, i) => (
                        <li key={point.title} data-reveal style={{ "--reveal-i": i + 3 } as React.CSSProperties} className="flex gap-4">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-800 text-accent-400">
                                <point.icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div>
                                <h3 className="font-display text-xl font-bold tracking-tight text-white">{point.title}</h3>
                                <p className="mt-2 text-base leading-relaxed text-zinc-400">{point.body}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};
