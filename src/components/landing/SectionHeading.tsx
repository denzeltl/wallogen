import React from 'react';

interface SectionHeadingProps {
  label: string;
  title: string;
  lede?: string;
  align?: 'left' | 'center';
  children?: React.ReactNode;
}

/** Label, heading and lede for a landing section; each part reveals in reading order. */
export const SectionHeading: React.FC<SectionHeadingProps> = ({ label, title, lede, align = 'left', children }) => {
  const centered = align === 'center';
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${centered ? 'items-center text-center md:flex-col md:items-center' : ''}`}>
      <div className={`min-w-0 ${centered ? 'mx-auto' : ''}`}>
        <p data-reveal className="font-mono text-xs uppercase tracking-wider text-accent-400">
          {label}
        </p>
        <h2
          data-reveal
          style={{ '--reveal-i': 1 } as React.CSSProperties}
          className="mt-3 max-w-3xl font-display text-4xl sm:text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white"
        >
          {title}
        </h2>
        {lede && (
          <p
            data-reveal
            style={{ '--reveal-i': 2 } as React.CSSProperties}
            className={`mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-zinc-400 ${centered ? 'mx-auto' : ''}`}
          >
            {lede}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};
