import React from 'react';

interface LogoIconProps {
  size?: number | string;
  className?: string;
  variant?: 'gradient' | 'monochrome' | 'dark';
}

export const LogoIcon: React.FC<LogoIconProps> = ({
  size = 32,
  className = '',
  variant = 'gradient'
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
    >
      <defs>
        {/* Background Squircle Gradient */}
        <linearGradient id="ep-docs-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#020617" />
          <stop offset="100%" stopColor="#0B0F19" />
        </linearGradient>

        {/* Outer Specular Ring Gradient */}
        <linearGradient id="ep-docs-border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#818CF8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E11D48" stopOpacity="0.8" />
        </linearGradient>

        {/* Top Isometric Layer (Frontends: React 19 & Flutter) */}
        <linearGradient id="ep-layer-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Middle Layer (Laravel 12 Engine) */}
        <linearGradient id="ep-layer-mid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>

        {/* Bottom Layer (PostgreSQL 18 Persistence) */}
        <linearGradient id="ep-layer-bot" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Central Core Glow Filter */}
        <filter id="ep-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Apple-Style Squircle Outer Frame with Border */}
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="10"
        fill="url(#ep-docs-bg)"
        stroke="url(#ep-docs-border)"
        strokeWidth="1.5"
      />

      {/* 2. Top Layer Plate (Presentation Layer) */}
      <path
        d="M20 7.5L29.5 12.5L20 17.5L10.5 12.5L20 7.5Z"
        fill="url(#ep-layer-top)"
        stroke="#7DD3FC"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* 3. Middle Layer Plate (Laravel 12 REST Engine) */}
      <path
        d="M10.5 18L20 23L29.5 18M10.5 20.5L20 25.5L29.5 20.5"
        stroke="url(#ep-layer-mid)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 4. Bottom Layer Plate (PostgreSQL 18 DB) */}
      <path
        d="M10.5 25.5L20 30.5L29.5 25.5M10.5 28L20 33L29.5 28"
        stroke="url(#ep-layer-bot)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 5. Center Glowing Node (Live Atomic Sync Point) */}
      <circle
        cx="20"
        cy="12.5"
        r="2"
        fill="#FFFFFF"
        filter="url(#ep-glow)"
      />
      <circle
        cx="20"
        cy="12.5"
        r="1"
        fill="#0284C7"
      />
    </svg>
  );
};
