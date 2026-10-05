"use client";

import React, { useState } from "react";
import { ArrowUp, Dices, Hourglass, RefreshCw, Sparkles, Undo2 } from "lucide-react";
import { AiNotice, AiResult, describeRetry, requestAiWallpaper } from "@/lib/ai/client";
import { MAX_PROMPT_LENGTH, MIN_PROMPT_LENGTH } from "@/lib/ai/constants";

interface AiPromptBarProps {
    canUndo: boolean;
    onApply: (result: AiResult) => void;
    onUndo: () => void;
    onNewVariation: () => void;
    onBusyChange: (busy: boolean) => void;
}

const EXAMPLE_PROMPTS = [
    "calm ocean at dusk",
    "neon city in the rain",
    "cozy autumn, film grain",
    "northern lights",
    "minimal sand dunes",
];

function noticeCopy(notice: AiNotice): { title: string; body: string } {
    const retry = describeRetry(notice.retryAt);
    switch (notice.kind) {
        case "daily_limit":
            return {
                title: "Today's free AI wallpapers are all used up",
                body: `No worries, we styled a close match from your words instead. AI wallpapers come back ${retry ?? "tomorrow"}.`,
            };
        case "busy":
            return {
                title: "The AI is catching its breath",
                body: `Lots of wallpapers are being dreamed up right now, so here's a close match from your words. Try AI again ${retry ?? "in a minute"}.`,
            };
        default:
            return {
                title: "The AI is taking a short break",
                body: "Here's a close match from your words instead. You can fine-tune it with the controls below.",
            };
    }
}

export const AiPromptBar: React.FC<AiPromptBarProps> = ({ canUndo, onApply, onUndo, onNewVariation, onBusyChange }) => {
    const [prompt, setPrompt] = useState("");
    const [lastPrompt, setLastPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AiResult | null>(null);

    const trimmed = prompt.trim();
    const canSubmit = !isLoading && trimmed.length >= MIN_PROMPT_LENGTH;

    const generate = async (text: string) => {
        const clean = text.trim();
        if (isLoading || clean.length < MIN_PROMPT_LENGTH) return;
        setIsLoading(true);
        onBusyChange(true);
        try {
            const next = await requestAiWallpaper(clean.slice(0, MAX_PROMPT_LENGTH));
            setResult(next);
            setLastPrompt(clean);
            onApply(next);
        } finally {
            setIsLoading(false);
            onBusyChange(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        void generate(prompt);
    };

    const notice = result?.notice ? noticeCopy(result.notice) : null;

    return (
        <div className="px-3 py-2.5 border-b border-zinc-800/80 bg-zinc-950 space-y-2 shrink-0">
            <form onSubmit={handleSubmit} className="relative">
                <label htmlFor="ai-prompt" className="sr-only">
                    Describe the wallpaper you want
                </label>
                <Sparkles
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400 pointer-events-none"
                />
                <input
                    id="ai-prompt"
                    type="text"
                    value={prompt}
                    maxLength={MAX_PROMPT_LENGTH}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe a wallpaper…"
                    autoComplete="off"
                    enterKeyHint="go"
                    className="w-full h-11 pl-9 pr-12 rounded-xl bg-zinc-900 border border-zinc-800 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
                <button
                    type="submit"
                    disabled={!canSubmit}
                    aria-label="Generate wallpaper from description"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 motion-reduce:transform-none"
                >
                    {isLoading ? (
                        <span className="w-3.5 h-3.5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                    ) : (
                        <ArrowUp className="w-4 h-4" />
                    )}
                </button>
            </form>

            {!result && (
                <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-3 px-3" aria-label="Example prompts">
                    {EXAMPLE_PROMPTS.map((example) => (
                        <button
                            key={example}
                            type="button"
                            disabled={isLoading}
                            onClick={() => {
                                setPrompt(example);
                                void generate(example);
                            }}
                            className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 hover:text-zinc-100 hover:border-cyan-500/40 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                        >
                            {example}
                        </button>
                    ))}
                </div>
            )}

            {notice && (
                <div
                    role="status"
                    className="flex gap-2.5 p-2.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 animate-in fade-in duration-300"
                >
                    <Hourglass aria-hidden="true" className="w-4 h-4 mt-0.5 text-amber-300/80 shrink-0" />
                    <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-amber-100">{notice.title}</p>
                        <p className="text-[11px] leading-relaxed text-amber-100/70">{notice.body}</p>
                    </div>
                </div>
            )}

            {result && (
                <div className="flex items-start justify-between gap-2" aria-live="polite">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-100 truncate">
                            <span className={result.source === "ai" ? "text-cyan-400" : "text-zinc-500"}>
                                {result.source === "ai" ? "AI" : "Close match"}
                            </span>
                            <span className="text-zinc-600"> · </span>
                            {result.config.title}
                        </p>
                        {result.config.rationale && (
                            <p className="text-[11px] leading-snug text-zinc-500 line-clamp-2">{result.config.rationale}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <IconButton label="New variation (same style, new seed)" onClick={onNewVariation} disabled={isLoading}>
                            <Dices className="w-3.5 h-3.5" />
                        </IconButton>
                        <IconButton label="Reinterpret this description" onClick={() => void generate(lastPrompt)} disabled={isLoading}>
                            <RefreshCw className="w-3.5 h-3.5" />
                        </IconButton>
                        <IconButton
                            label="Undo: restore the previous wallpaper"
                            onClick={() => {
                                onUndo();
                                setResult(null);
                            }}
                            disabled={isLoading || !canUndo}
                        >
                            <Undo2 className="w-3.5 h-3.5" />
                        </IconButton>
                    </div>
                </div>
            )}

            <p className="text-[10px] leading-snug text-zinc-600">
                Only your text is sent to Google Gemini to pick a style. Please don&apos;t include personal info.
            </p>
        </div>
    );
};

const IconButton: React.FC<{ label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }> = ({
    label,
    onClick,
    disabled,
    children,
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        title={label}
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-cyan-500/40 disabled:opacity-40 disabled:hover:text-zinc-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
    >
        {children}
    </button>
);
