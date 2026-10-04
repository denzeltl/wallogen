'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Coffee, RefreshCw, Layers } from 'lucide-react';
import { PATTERNS, renderWallpaper } from '@/lib/engine';
import { CURATED_PALETTES } from '@/lib/palettes';

export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [patternIndex, setPatternIndex] = useState(0);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [seed, setSeed] = useState(42);

  const activePattern = PATTERNS[patternIndex % PATTERNS.length];
  const activePalette = CURATED_PALETTES[paletteIndex % CURATED_PALETTES.length];

  // Draw interactive live canvas preview on landing page with DPR scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = 1200 * dpr;
    canvas.height = 675 * dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    renderWallpaper(ctx, 1200, 675, activePattern.id, activePalette, {
      ...activePattern.defaultParams,
      seed,
    });
    ctx.restore();
  }, [activePattern, activePalette, seed]);

  const handleShuffleHero = () => {
    setPatternIndex((prev) => prev + 1);
    setPaletteIndex((prev) => prev + 1);
    setSeed(Math.floor(Math.random() * 99999));
  };

  return (
    <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-900/90 border border-zinc-800 text-zinc-300 mb-8 shadow-sm backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>Minimalist 4K & Mobile Wallpaper Generator</span>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse motion-reduce:animate-none" />
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
        Clean, High-Res Wallpapers for <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Any Screen</span>.
      </h1>

      {/* Subtext */}
      <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
        Procedurally generate minimalist vector wallpapers for 4K desktop monitors, ultrawide setups, iPhones, Android devices, and tablets in seconds. Zero sign-up, zero ads.
      </p>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Link
          href="/generate"
          className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 ease-out active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 motion-reduce:transform-none"
        >
          <span>Start Generating Free</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200 ease-out motion-reduce:transform-none" />
        </Link>
        <a
          href="https://buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-amber-400 hover:text-amber-300 shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-out active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 motion-reduce:transform-none"
        >
          <Coffee className="w-5 h-5 text-amber-400 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 ease-out motion-reduce:transform-none" />
          <span>Buy Me a Coffee</span>
        </a>
      </div>

      {/* Live Canvas Preview Widget */}
      <div className="mt-14 w-full max-w-4xl rounded-2xl p-3 bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-md relative group transition-all duration-300 hover:border-zinc-700/80">
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 mb-3 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block group-hover:scale-110 transition-transform duration-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block group-hover:scale-110 transition-transform duration-200 delay-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block group-hover:scale-110 transition-transform duration-200 delay-150" />
            <span className="ml-2 font-sans font-semibold text-zinc-300">Live Canvas Demo</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-zinc-400 hidden sm:inline">{activePattern.name} • {activePalette.name}</span>
            <button
              onClick={handleShuffleHero}
              aria-label="Shuffle demo wallpaper"
              className="group/shuffle flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-all duration-200 active:scale-95 hover:border hover:border-blue-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 motion-reduce:transform-none"
              title="Shuffle Demo Canvas"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400 group-hover/shuffle:rotate-180 transition-transform duration-500 ease-out motion-reduce:transform-none" />
              <span>Shuffle Demo</span>
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 aspect-video bg-black shadow-inner">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`Live wallpaper preview displaying ${activePattern.name} pattern in ${activePalette.name} palette`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
