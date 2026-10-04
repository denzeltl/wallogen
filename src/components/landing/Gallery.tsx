'use client';

import React from 'react';
import Link from 'next/link';
import { PATTERNS } from '@/lib/engine';
import { CURATED_PALETTES } from '@/lib/palettes';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Gallery: React.FC = () => {
  const showcaseItems = [
    {
      title: 'Ocean Sine Waves',
      pattern: PATTERNS.find((p) => p.id === 'waves') || PATTERNS[0],
      palette: CURATED_PALETTES.find((p) => p.id === 'tokyo_night') || CURATED_PALETTES[0],
      tag: 'Desktop 4K',
    },
    {
      title: 'Aurora Curtain Light',
      pattern: PATTERNS.find((p) => p.id === 'aurora') || PATTERNS[0],
      palette: CURATED_PALETTES.find((p) => p.id === 'cyberpunk_dark') || CURATED_PALETTES[0],
      tag: 'Cyberpunk',
    },
    {
      title: 'Prism Kaleidoscope',
      pattern: PATTERNS.find((p) => p.id === 'kaleidoscope') || PATTERNS[0],
      palette: CURATED_PALETTES.find((p) => p.id === 'dracula_neon') || CURATED_PALETTES[0],
      tag: 'Geometry',
    },
    {
      title: 'Nordic Snow Topography',
      pattern: PATTERNS.find((p) => p.id === 'topography') || PATTERNS[0],
      palette: CURATED_PALETTES.find((p) => p.id === 'nord_light') || CURATED_PALETTES[0],
      tag: 'Light Mode',
    },
    {
      title: 'Liquid Silk Ribbons',
      pattern: PATTERNS.find((p) => p.id === 'silkFlow') || PATTERNS[0],
      palette: CURATED_PALETTES.find((p) => p.id === 'deep_space') || CURATED_PALETTES[0],
      tag: 'Flow Field',
    },
    {
      title: 'Voronoi Stained Glass',
      pattern: PATTERNS.find((p) => p.id === 'voronoi') || PATTERNS[0],
      palette: CURATED_PALETTES.find((p) => p.id === 'gruvbox_dark') || CURATED_PALETTES[0],
      tag: 'Gruvbox',
    },
  ];

  return (
    <section id="gallery" className="py-20 px-6 max-w-7xl mx-auto border-t border-zinc-800/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/10 text-blue-400 border border-blue-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Endless Procedural Styles
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Click any showcase preset below to launch the Generator Studio with that exact configuration.
          </p>
        </div>

        <Link
          href="/generate"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all self-start md:self-auto"
        >
          <span>Open Generator App</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {showcaseItems.map((item, idx) => (
          <Link
            key={idx}
            href={`/generate`}
            className="group rounded-2xl p-4 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all hover:bg-zinc-900 flex flex-col justify-between"
          >
            {/* Visual Swatch Card */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800/80 mb-4 bg-zinc-950 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 opacity-80 group-hover:scale-105 transition-transform duration-300"
                style={{
                  background: `linear-gradient(135deg, ${item.palette.background} 0%, ${item.palette.colors[0]} 50%, ${item.palette.colors[1]} 100%)`,
                }}
              />
              <div className="relative z-10 font-bold text-xs text-white bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800 backdrop-blur-md shadow-lg">
                {item.pattern.name}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-zinc-200 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                  {item.palette.name} Palette
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700/50">
                {item.tag}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
