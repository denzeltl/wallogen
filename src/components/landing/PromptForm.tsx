"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Sparkles } from "lucide-react";
import { MAX_PROMPT_LENGTH, MIN_PROMPT_LENGTH } from "@/lib/ai/constants";
import { savePendingPrompt } from "@/lib/ai/handoff";

/** Opens the generator and runs the given description through the AI there. */
export function useLaunchPrompt() {
    const router = useRouter();
    return (prompt: string) => {
        const clean = prompt.trim().slice(0, MAX_PROMPT_LENGTH);
        if (clean.length < MIN_PROMPT_LENGTH) return;
        savePendingPrompt(clean);
        router.push("/generate");
    };
}

interface PromptFormProps {
    id: string;
    placeholder?: string;
}

/** Glass "describe a wallpaper" field used on the landing page. */
export const PromptForm: React.FC<PromptFormProps> = ({ id, placeholder = "Describe a wallpaper…" }) => {
    const [prompt, setPrompt] = useState("");
    const launch = useLaunchPrompt();
    const canSubmit = prompt.trim().length >= MIN_PROMPT_LENGTH;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                launch(prompt);
            }}
            className="group relative w-full max-w-2xl"
        >
            <label htmlFor={id} className="sr-only">
                Describe the wallpaper you want
            </label>
            <Sparkles
                aria-hidden="true"
                className="pointer-events-none absolute z-10 left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-400"
            />
            <input
                id={id}
                type="text"
                value={prompt}
                maxLength={MAX_PROMPT_LENGTH}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholder}
                autoComplete="off"
                enterKeyHint="go"
                className="h-16 w-full min-w-0 rounded-full border border-white/20 bg-zinc-950/60 pl-14 pr-16 text-base text-white shadow-2xl shadow-black/40 backdrop-blur-xl transition-colors placeholder:text-zinc-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 sm:text-lg"
            />
            <button
                type="submit"
                disabled={!canSubmit}
                aria-label="Generate this wallpaper with AI"
                className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-accent-500 text-zinc-950 transition-[transform,background-color] duration-150 [@media(hover:hover)]:hover:bg-accent-400 active:scale-[0.94] disabled:bg-zinc-800 disabled:text-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transform-none"
            >
                <ArrowUp className="h-5 w-5" />
            </button>
        </form>
    );
};
