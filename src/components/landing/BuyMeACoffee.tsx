import React from 'react';
import { Coffee, Heart, ExternalLink } from 'lucide-react';

export const BuyMeACoffeeSection: React.FC = () => {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto border-t border-zinc-800/60 text-center">
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-amber-500/10 via-zinc-900/90 to-zinc-950 border border-amber-500/20 shadow-2xl relative overflow-hidden flex flex-col items-center">
        <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-6 shadow-inner">
          <Coffee className="w-8 h-8" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-xl">
          Love Wallogen? Support the Creator!
        </h2>

        <p className="mt-4 text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
          Wallogen is built with care for the minimalist community. If this generator saved you time or made your desktop setup look awesome, consider buying me a coffee to support future updates!
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-1 transition-all duration-200 ease-out active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 motion-reduce:transform-none"
          >
            <Coffee className="w-5 h-5 text-zinc-950 fill-zinc-950 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 ease-out motion-reduce:transform-none" />
            <span>Buy Me a Coffee</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-80 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200 motion-reduce:transform-none" />
          </a>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs font-medium text-amber-400/90 group">
          <Heart className="w-3.5 h-3.5 fill-amber-400 group-hover:scale-125 transition-transform duration-300 motion-reduce:transform-none" />
          <span>Thank you for supporting independent open tools!</span>
        </div>
      </div>
    </section>
  );
};
