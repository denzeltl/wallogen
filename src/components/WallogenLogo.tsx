import React, { useId } from 'react';

interface WallogenLogoProps {
  size?: number;
  className?: string;
  /** Tile colour behind the bands. */
  tone?: 'dark' | 'blue';
}

/**
 * Wallogen "Strata" mark: a wallpaper in miniature, three stacked wave bands whose top edges form a W.
 * Source of truth for public/brand/*.svg and the app icons.
 */
export const WallogenLogo: React.FC<WallogenLogoProps> = ({ size = 28, className = '', tone = 'dark' }) => {
  const clipId = useId();
  const tile = tone === 'blue' ? '#2563eb' : '#09090b';
  const ink = tone === 'blue' ? '#ffffff' : '#fafafa';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="32" height="32" rx="7" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="32" height="32" fill={tile} />
        <path d="M0 12l8 8 8-9 8 9 8-8v20H0z" fill={ink} opacity=".35" />
        <path d="M0 17l8 7 8-8 8 8 8-7v15H0z" fill={ink} opacity=".65" />
        <path d="M0 23l8 5 8-6 8 6 8-5v9H0z" fill={ink} />
      </g>
      <rect x=".5" y=".5" width="31" height="31" rx="6.5" fill="none" stroke="#27272a" />
    </svg>
  );
};
