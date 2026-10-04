'use client';

import React from 'react';
import { ShieldCheck, Monitor, Sparkles, Coffee, Cpu, Download } from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: '100% Client-Side & Private',
      description: 'Zero data collection or image uploads. All wallpapers are procedurally rendered 100% inside your browser using HTML5 Canvas 2D.',
    },
    {
      icon: <Monitor className="w-6 h-6 text-blue-400" />,
      title: '4K Desktop & Mobile Native',
      description: 'Export razor-sharp PNG and JPG wallpapers at native 4K (3840×2160), QHD, Ultrawide, 8K, iPhone 15 Pro, Android, or custom pixel specs.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-blue-400" />,
      title: '14 Procedural Pattern Engines',
      description: 'Infinite mathematical variations spanning ocean waves, organic gaussian mesh, contour topography, silk ribbons, aurora light, and prism geometry.',
    },
    {
      icon: <Coffee className="w-6 h-6 text-amber-400" />,
      title: 'Free Forever & Creator Supported',
      description: 'No accounts, paywalls, or subscription pop-ups. Supported purely by voluntary Buy Me a Coffee donations from minimalists worldwide.',
    },
  ];

  return (
    <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-zinc-800/60">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Engineered for Clean Minimalist Workspaces
        </h2>
        <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
          Wallogen turns pure procedural mathematics into crisp, distraction-free desktop and mobile backgrounds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featureList.map((feature, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all hover:bg-zinc-900/80 group flex flex-col justify-between"
          >
            <div>
              <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 w-fit mb-5 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-bold text-base text-zinc-100 mb-2">{feature.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
