import React from 'react';

interface WallogenLogoProps {
  size?: number;
  className?: string;
}

/**
 * Wallogen Redesigned Logo Emblem
 * Procedural Vector "W" Emblem with flowing cyan-to-blue sine wave contours
 */
export const WallogenLogo: React.FC<WallogenLogoProps> = ({ size = 28, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Glowing Gradient for W Outer Frame & Procedural Waves */}
        <linearGradient id="wallogen-cyan-glow" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        <linearGradient id="wallogen-stroke-grad" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        <filter id="cyan-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Rounded Shield */}
      <rect width="40" height="40" rx="10" fill="#09090B" />
      <rect width="40" height="40" rx="10" stroke="url(#wallogen-stroke-grad)" strokeWidth="1" strokeOpacity="0.3" />

      {/* Geometric 'W' Outer Vector Frame */}
      <path
        d="M 6 10 L 13 32 L 20 18 L 27 32 L 34 10 L 29 10 L 24.5 24 L 20 14 L 15.5 24 L 11 10 Z"
        fill="url(#wallogen-cyan-glow)"
        fillOpacity="0.15"
        stroke="url(#wallogen-stroke-grad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#cyan-glow-filter)"
      />

      {/* Internal Procedural Sine Wave Contour Lines */}
      <path
        d="M 8 16 C 12 24, 16 12, 20 20 C 24 28, 28 12, 32 16"
        stroke="#38BDF8"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.9"
        fill="none"
      />
      <path
        d="M 9 19 C 13 26, 17 14, 20 22 C 23 29, 27 14, 31 19"
        stroke="#06B6D4"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.75"
        fill="none"
      />
      <path
        d="M 10 22 C 14 28, 17 16, 20 24 C 23 30, 26 16, 30 22"
        stroke="#2563EB"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.6"
        fill="none"
      />
    </svg>
  );
};
