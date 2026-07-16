"use client";

import { useRef, useState } from "react";
import { haptic } from "@/lib/audio";

// Some things shouldn't be tappable. Sandhyavandanam is marked by touching and
// holding for three seconds — ripples spread like water offered from cupped hands.
export default function HoldButton({
  done,
  onComplete,
  label,
  doneLabel,
}: {
  done: boolean;
  onComplete: () => void;
  label: string;
  doneLabel: string;
}) {
  const [progress, setProgress] = useState(0);
  const [rippling, setRippling] = useState(false);
  const raf = useRef<number | null>(null);
  const start = useRef(0);
  const HOLD_MS = 3000;

  const tick = () => {
    const p = Math.min(1, (performance.now() - start.current) / HOLD_MS);
    setProgress(p);
    if (p >= 1) {
      finish();
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const finish = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setRippling(true);
    haptic([12, 40, 12, 40, 12]);
    setTimeout(() => setRippling(false), 1600);
    onComplete();
    setProgress(0);
  };

  const begin = () => {
    if (done) return;
    start.current = performance.now();
    haptic(6);
    raf.current = requestAnimationFrame(tick);
  };

  const cancel = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    if (progress < 1) setProgress(0);
  };

  return (
    <button
      onPointerDown={begin}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onContextMenu={(e) => e.preventDefault()}
      disabled={done}
      className={`relative w-full overflow-hidden rounded-2xl py-4 px-4 text-center select-none transition ${
        done ? "bg-amber-300/20 border border-amber-200/40" : "bg-white/5 border border-white/15 active:scale-[0.99]"
      }`}
      style={{ touchAction: "none" }}
    >
      {/* fill meter */}
      {!done && (
        <div
          className="absolute inset-y-0 left-0 bg-amber-300/25"
          style={{ width: `${progress * 100}%`, transition: progress === 0 ? "width .3s ease" : "none" }}
        />
      )}

      {rippling && (
        <>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-amber-200/60 animate-ripple" />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-amber-200/40 animate-ripple"
            style={{ animationDelay: "0.25s" }}
          />
        </>
      )}

      <div className="relative flex items-center justify-center gap-2.5">
        <img
          src={done ? "/diya-lit.webp" : "/diya-unlit.webp"}
          alt=""
          className="h-7 w-auto object-contain"
          style={{ filter: done ? "drop-shadow(0 0 8px rgba(255,180,90,0.6))" : "none" }}
        />
        <span className={`text-sm font-medium ${done ? "text-amber-100" : "text-white/80"}`}>
          {done ? doneLabel : progress > 0 ? "keep holding…" : label}
        </span>
      </div>
    </button>
  );
}
