import React from "react";
import { Coffee, ExternalLink } from "lucide-react";

export const BuyMeACoffeeSection: React.FC = () => {
    return (
        <section aria-labelledby="support-heading" className="px-4 sm:px-6 py-24 sm:py-32">
            <div className="max-w-3xl mx-auto text-center">
                <p data-reveal className="font-mono text-xs uppercase tracking-wider text-amber-400">
                    Support
                </p>
                <h2
                    id="support-heading"
                    data-reveal
                    style={{ "--reveal-i": 1 } as React.CSSProperties}
                    className="mt-3 font-display text-4xl sm:text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white"
                >
                    Free, with no ads. A coffee keeps it that way.
                </h2>
                <p
                    data-reveal
                    style={{ "--reveal-i": 2 } as React.CSSProperties}
                    className="mt-4 mx-auto max-w-xl text-base sm:text-lg leading-relaxed text-zinc-400"
                >
                    Wallogen is built and paid for by one person. If it gave your desktop a new look, a coffee
                    covers the AI costs and funds the next engine.
                </p>
                <div data-reveal style={{ "--reveal-i": 3 } as React.CSSProperties} className="mt-8">
                    <a
                        href="https://buymeacoffee.com/denzeltl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-amber-500 px-7 text-base font-semibold text-zinc-950 transition-[transform,background-color] duration-150 [@media(hover:hover)]:hover:bg-amber-400 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 motion-reduce:transform-none"
                    >
                        <Coffee className="h-5 w-5 transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:-rotate-12 motion-reduce:transform-none" />
                        Buy me a coffee
                        <ExternalLink className="h-4 w-4 opacity-70" aria-hidden="true" />
                    </a>
                </div>
            </div>
        </section>
    );
};
