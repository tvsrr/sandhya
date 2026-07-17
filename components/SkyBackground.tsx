"use client";

import { useMemo } from "react";
import { skyForProgress, sunHeight } from "@/lib/sky";

// Fixed full-viewport sky. Its gradient IS the design system.
export default function SkyBackground({
  progress,
  segmentsToday,
}: {
  progress: number;
  segmentsToday: number;
}) {
  const sky = skyForProgress(progress);
  const height = sunHeight(progress, segmentsToday);

  // Stars fade out as the dawn brightens.
  const starOpacity = Math.max(0, 0.9 - progress * 1.2);

  const stars = useMemo(
    () =>
      Array.from({ length: 42 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 62,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 6,
      })),
    []
  );

  // Sun sits from horizon (bottom) upward by `height`.
  const sunBottom = `${height * 78}%`;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: sky.gradient }}>
      {/* breathing overlay for pre-dawn air */}
      <div className="absolute inset-0 animate-breathe" style={{ background: sky.gradient, opacity: 0.4 }} />

      {/* stars */}
      <div className="absolute inset-0" style={{ opacity: starOpacity }}>
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-breathe"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              boxShadow: "0 0 4px rgba(255,255,255,0.8)",
            }}
          />
        ))}
      </div>

      {/* the sun — a warm horizon glow, kept low so it never haloes the UI */}
      <div
        className="absolute left-1/2"
        style={{
          bottom: sunBottom,
          transform: "translateX(-50%) translateY(45%)",
          transition: "bottom 1.6s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: 92,
            height: 92,
            background: "radial-gradient(circle at 50% 45%, rgba(255,246,218,0.75) 0%, rgba(255,177,90,0.4) 42%, rgba(255,180,90,0) 70%)",
            filter: "blur(3px)",
            opacity: 0.5 + progress * 0.4,
          }}
        />
      </div>

      {/* horizon glow band */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: `linear-gradient(0deg, ${sky.horizon} 0%, rgba(0,0,0,0) 100%)`,
          opacity: 0.7,
        }}
      />
    </div>
  );
}
