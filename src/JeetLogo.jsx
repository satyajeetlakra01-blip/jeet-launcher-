import React from 'react';

export default function JeetLogo({ className = "w-10 h-10", glow = true }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-cyan-500/25 rounded-2xl blur-lg pointer-events-none transform scale-110" />
      )}
      <svg
        viewBox="0 0 512 512"
        className="w-full h-full relative z-10 drop-shadow-md select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="jeetBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#0a0f1d" />
            <stop offset="100%" stopColor="#05070d" />
          </linearGradient>

          <linearGradient id="jeetBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="35%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          <linearGradient id="jeetUpper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <linearGradient id="jeetLower" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          <linearGradient id="jeetSpine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#e0f2fe" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.4" />
          </linearGradient>

          <filter id="jeetGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Squircle Beveled Frame */}
        <rect
          x="36"
          y="36"
          width="440"
          height="440"
          rx="108"
          fill="url(#jeetBg)"
          stroke="url(#jeetBorder)"
          strokeWidth="10"
        />

        {/* Inner Cyber Rim */}
        <rect
          x="54"
          y="54"
          width="404"
          height="404"
          rx="90"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.08"
          strokeWidth="2.5"
        />

        {/* Tech Corner Pins */}
        <circle cx="80" cy="80" r="4.5" fill="#00f2fe" opacity="0.75" />
        <circle cx="432" cy="80" r="4.5" fill="#00f2fe" opacity="0.75" />
        <circle cx="80" cy="432" r="4.5" fill="#10b981" opacity="0.75" />
        <circle cx="432" cy="432" r="4.5" fill="#10b981" opacity="0.75" />

        {/* Status Indicator Pip */}
        <circle cx="390" cy="80" r="7" fill="#00f2fe" opacity="0.3" />
        <circle cx="390" cy="80" r="4" fill="#00f2fe" />
        <circle cx="390" cy="80" r="1.5" fill="#ffffff" />

        {/* Lightning Bolt + J Monogram */}
        <g filter="url(#jeetGlow)">
          {/* Main Bolt */}
          <path
            d="M298 76 L152 270 L252 270 L188 440 L364 220 L260 220 Z"
            fill="url(#jeetUpper)"
          />

          {/* Lower Speed Blade */}
          <path
            d="M252 270 L188 440 L280 326 L238 316 Z"
            fill="url(#jeetLower)"
          />

          {/* Under-Hook Wing */}
          <path
            d="M188 440 Q 150 430 140 390 Q 134 360 156 348 Q 166 344 176 354 Q 186 366 188 440 Z"
            fill="url(#jeetLower)"
            opacity="0.85"
          />

          {/* Razor Spine */}
          <path
            d="M288 100 L176 256 L254 256 L204 400 L340 234 L260 234 Z"
            fill="none"
            stroke="url(#jeetSpine)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vertex Apex Star */}
          <polygon
            points="298,64 304,76 316,82 304,88 298,100 292,88 280,82 292,76"
            fill="#ffffff"
          />
        </g>
      </svg>
    </div>
  );
}
