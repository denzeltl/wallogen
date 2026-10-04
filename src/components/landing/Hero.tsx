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

  // Draw interactive live canvas preview on landing page
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 675;

    renderWallpaper(ctx, 1200, 675, activePattern.id, activePalette, {
      ...activePattern.defaultParams,
      seed,
    });
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
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
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
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/25 transition-all active:scale-[0.98]"
        >
          <span>Start Generating Free</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        <a
          href="https://buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-amber-400 transition-all active:scale-[0.98]"
        >
          <Coffee className="w-5 h-5 text-amber-400" />
          <span>Buy Me a Coffee</span>
        </a>
      </div>

      {/* Live Canvas Preview Widget */}
      <div className="mt-14 w-full max-w-4xl rounded-2xl p-3 bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-md relative group">
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 mb-3 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            <span className="ml-2 font-sans font-semibold text-zinc-300">Live Canvas Demo</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-zinc-500 hidden sm:inline">{activePattern.name} • {activePalette.name}</span>
            <button
              onClick={handleShuffleHero}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-all active:scale-95"
              title="Shuffle Demo Canvas"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Shuffle Demo</span>
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 aspect-video bg-black shadow-inner">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
