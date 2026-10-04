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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all self-start md:self-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
            aria-label={`Open studio with ${item.title} preset using ${item.pattern.name} pattern and ${item.palette.name} palette`}
            className="group rounded-2xl p-4 bg-zinc-900/60 border border-zinc-800 hover:border-blue-500/40 hover:bg-zinc-900/90 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 ease-out active:scale-[0.98] flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 motion-reduce:transform-none"
          >
            {/* Visual Swatch Card */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800/80 mb-4 bg-zinc-950 flex items-center justify-center p-4">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500 ease-out motion-reduce:transform-none"
                style={{
                  background: `linear-gradient(135deg, ${item.palette.background} 0%, ${item.palette.colors[0]} 50%, ${item.palette.colors[1]} 100%)`,
                }}
              />
              <div className="relative z-10 font-bold text-xs text-white bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800/80 backdrop-blur-md shadow-lg group-hover:border-zinc-700 group-hover:scale-105 transition-all duration-200 motion-reduce:transform-none">
                {item.pattern.name}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-zinc-200 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200 ease-out motion-reduce:transform-none">
                  {item.title}
                </h3>
                <span className="text-xs text-zinc-400 font-mono mt-0.5 block">
                  {item.palette.name} Palette
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-300 bg-zinc-800/80 group-hover:bg-blue-600/20 group-hover:text-blue-300 group-hover:border-blue-500/40 px-2 py-0.5 rounded-md border border-zinc-700/50 transition-all duration-200">
                {item.tag}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
