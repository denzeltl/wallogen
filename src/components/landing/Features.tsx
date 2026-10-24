import React from 'react';
import { SectionHeading } from './SectionHeading';

const STEPS = [
  {
    num: '01',
    title: 'Pick an engine or describe a scene',
    description:
      'Choose from 18 engines such as Ocean Waves, Aurora, Origami Peaks and Frosted Glass, or type "red house at dusk" and the AI picks the pattern, colours and settings for you.',
  },
  {
    num: '02',
    title: 'Tune it live',
    description:
      'Change the seed, scale, density, rotation and grain, or swap between 13 curated palettes. Every change re-renders instantly in your browser.',
  },
  {
    num: '03',
    title: 'Download at your exact resolution',
    description:
      'Exports are rendered again from the math at full size: 3840×2160 for 4K, 5120×1440 for ultrawide, 1290×2796 for iPhone, or any custom size up to 8K.',
  },
];

const FACTS = [
  { value: '18', label: 'Engines' },
  { value: '8K', label: 'Max export' },
  { value: '0', label: 'Uploads' },
  { value: '$0', label: 'Price' },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-zinc-800/60">
      <SectionHeading
        label="How it works"
        title="Three steps from idea to wallpaper."
        lede="Nothing is downloaded from a library. Each wallpaper is drawn from code the moment you ask for it, so it is sharp at any size."
      />

      <ol className="mt-16 grid grid-cols-1 md:grid-cols-3 border-t border-zinc-800">
        {STEPS.map((step, i) => (
          <li
            key={step.num}
            data-reveal
            style={{ '--reveal-i': i + 3 } as React.CSSProperties}
            className="py-8 md:pr-8 border-b border-zinc-800 md:border-b-0 md:border-r md:last:border-r-0 md:[&:not(:first-child)]:pl-8"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">{step.num}</span>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">{step.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-zinc-400">{step.description}</p>
          </li>
        ))}
      </ol>

      <dl className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-y-8">
        {FACTS.map((fact, i) => (
          <div key={fact.label} data-reveal style={{ '--reveal-i': i } as React.CSSProperties}>
            <dt className="font-mono text-xs uppercase tracking-wider text-zinc-500">{fact.label}</dt>
            <dd className="mt-1 font-display text-5xl font-extrabold tracking-[-0.04em] text-white tabular-nums">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
