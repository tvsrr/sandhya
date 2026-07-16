"use client";

// Hand-drawn SVG glyphs for the moments where a color emoji felt like a compromise.

export function LetterMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <rect x="6" y="12" width="36" height="26" rx="3" fill="#fff8ee" stroke="#e6c98a" strokeWidth="1.5" />
      <path d="M7 14l17 13 17-13" stroke="#c9a24a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* wax seal */}
      <circle cx="24" cy="30" r="6.5" fill="#c0392b" />
      <circle cx="24" cy="30" r="6.5" fill="url(#waxg)" />
      <path d="M24 26.4l1.1 2.2 2.4.35-1.75 1.7.42 2.4L24 33.9l-2.17 1.15.42-2.4-1.75-1.7 2.4-.35z" fill="#ffcf6b" opacity="0.9" />
      <defs>
        <radialGradient id="waxg" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#e0574a" />
          <stop offset="1" stopColor="#8f2419" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function SunMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="sm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe6a3" />
          <stop offset="1" stopColor="#ff8c42" />
        </linearGradient>
      </defs>
      <path d="M4 34h40" stroke="#c9a24a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 34a15 15 0 0 1 30 0z" fill="url(#sm)" />
      {Array.from({ length: 9 }).map((_, i) => {
        const a = Math.PI - (i / 8) * Math.PI;
        const x1 = 24 + Math.cos(a) * 17;
        const y1 = 34 - Math.sin(a) * 17;
        const x2 = 24 + Math.cos(a) * 22;
        const y2 = 34 - Math.sin(a) * 22;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e6b45a" strokeWidth="1.3" strokeLinecap="round" />;
      })}
    </svg>
  );
}
