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

// Shared gold gradient for the cohesive icon set.
function GoldDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe6a3" />
        <stop offset="1" stopColor="#e59a4a" />
      </linearGradient>
    </defs>
  );
}

// KARMA — the forge: an anvil.
export function AnvilMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <GoldDefs id="anvilg" />
      <path
        d="M9 18h22c0 4-3 5.5-6 6h3l2.5 4H12l2.5-4h3c-3-.5-6-2-6-6h-5v-3h5z"
        fill="url(#anvilg)"
        stroke="#c9852f"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <rect x="17" y="30" width="14" height="3.5" rx="1" fill="#b9772a" />
      <rect x="14" y="33" width="20" height="4" rx="1.5" fill="url(#anvilg)" stroke="#c9852f" strokeWidth="0.8" />
    </svg>
  );
}

// CHITTA — the mind: an open book.
export function BookMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <GoldDefs id="bookg" />
      <path d="M24 15c-4-2.4-9-2.4-13-1v18c4-1.4 9-1.4 13 1z" fill="url(#bookg)" stroke="#c9852f" strokeWidth="1" strokeLinejoin="round" />
      <path d="M24 15c4-2.4 9-2.4 13-1v18c-4-1.4-9-1.4-13 1z" fill="#f6d99a" stroke="#c9852f" strokeWidth="1" strokeLinejoin="round" />
      <path d="M24 15v18" stroke="#c9852f" strokeWidth="1" />
      <path d="M14.5 20c2.5-.7 5-.7 7 0M14.5 24c2.5-.7 5-.7 7 0" stroke="#c9852f" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

// The Crossing — a small triad of flames.
export function FlameMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <GoldDefs id="flameg" />
      <path d="M24 12c3 4 6 6 6 11a6 6 0 0 1-12 0c0-3 1.5-4.5 3-6 .5 2 1.5 3 3 3.5-1-3.5 0-6 0-8.5z" fill="url(#flameg)" />
      <path d="M15 22c1.6 2 3 3.2 3 5.6a3.2 3.2 0 0 1-6.4 0c0-1.8 1.2-3 2.4-4 .2 1.2.7 1.7 1 2z" fill="#e59a4a" opacity="0.85" />
      <path d="M33 22c-1.6 2-3 3.2-3 5.6a3.2 3.2 0 0 0 6.4 0c0-1.8-1.2-3-2.4-4-.2 1.2-.7 1.7-1 2z" fill="#e59a4a" opacity="0.85" />
    </svg>
  );
}

// The Journey — a compass / north-star.
export function JourneyMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <GoldDefs id="journeyg" />
      <circle cx="24" cy="24" r="12" fill="none" stroke="#c9852f" strokeWidth="1" opacity="0.6" />
      <path d="M24 9l3.2 11.8L39 24l-11.8 3.2L24 39l-3.2-11.8L9 24l11.8-3.2z" fill="url(#journeyg)" />
      <circle cx="24" cy="24" r="2" fill="#fff8ee" />
    </svg>
  );
}

// The Path — a blade crossed with a temple spire.
export function PathMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <GoldDefs id="pathg" />
      <path d="M18 34L31 12l1.6 1-11 22z" fill="url(#pathg)" stroke="#c9852f" strokeWidth="0.7" />
      <path d="M30 34L17 12l-1.6 1 11 22z" fill="#f0c988" stroke="#c9852f" strokeWidth="0.7" />
      <path d="M24 30l3 6h-6z" fill="url(#pathg)" />
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
