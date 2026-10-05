import React from 'react';

export const Features: React.FC = () => {
  const specs = [
    {
      num: '01',
      title: 'Client-Side Canvas 2D Engine',
      description: 'Zero image uploads or tracking. All vector geometry is procedurally generated 100% inside your web browser.',
      tag: 'HTML5 Canvas',
    },
    {
      num: '02',
      title: 'Native 4K & Mobile Exports',
      description: 'Export crisp PNG and JPG backgrounds natively rendered at 3840×2160 (4K Desktop), Ultrawide, QHD, or iPhone pixel specs.',
      tag: 'Vector Math',
    },
    {
      num: '03',
      title: '18 Procedural Engines',
      description: 'Infinite mathematical variations spanning Frosted Glass Prisms, Volumetric Light Rays, Mesh Aura, Aurora Curtains, Origami Peaks, Silk Flow Fields, and Sine Waves.',
      tag: 'Procedural Art',
    },
    {
      num: '04',
      title: 'AI Prompt Art Director',
      description: 'Describe any scene like "red house at dusk", "neon tokyo", or "calm dune". Gemini translates your words into crisp editable vector wallpapers.',
      tag: 'AI Powered',
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-zinc-800/60">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-2 block">
            Engine Specifications
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Clean Minimalist Workspaces.
          </h2>
        </div>
        <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
          Wallogen combines mathematical procedural algorithms with HTML5 Canvas 2D graphics to eliminate desktop clutter.
        </p>
      </div>

      {/* 4-Column Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {specs.map((item) => (
          <div
            key={item.num}
            className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold text-zinc-500 group-hover:text-cyan-400 transition-colors">
                  {item.num}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-700/50">
                  {item.tag}
                </span>
              </div>

              <h3 className="font-bold text-base text-zinc-100 mb-2 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
