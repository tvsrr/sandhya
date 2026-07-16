"use client";

import { useEffect, useRef, useState } from "react";
import { haptic, sounds } from "@/lib/audio";
import { useSandhya } from "@/lib/store";

const HEAT_MS = 25 * 60 * 1000;
const TINK_EVERY = 5 * 60 * 1000;

export default function ForgeMode({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, completeHeat, addGritSpark, today } = useSandhya();
  const soundOn = state.soundOn;

  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sessionSparks, setSessionSparks] = useState(0);
  const [struck, setStruck] = useState(false);
  const [flyingSparks, setFlyingSparks] = useState<number[]>([]);
  const startRef = useRef(0);
  const baseRef = useRef(0);
  const tinkCountRef = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      const e = baseRef.current + (performance.now() - startRef.current);
      setElapsed(e);
      const tinks = Math.floor(e / TINK_EVERY);
      if (tinks > tinkCountRef.current && e < HEAT_MS) {
        tinkCountRef.current = tinks;
        sounds.tink(soundOn);
        haptic(8);
      }
      if (e >= HEAT_MS) {
        finishHeat();
      }
    }, 250);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const finishHeat = () => {
    if (timer.current) clearInterval(timer.current);
    setRunning(false);
    setElapsed(HEAT_MS);
    setStruck(true);
    sounds.hammer(soundOn);
    haptic([0, 60, 30, 120]);
    completeHeat();
    setTimeout(() => setStruck(false), 900);
  };

  const light = () => {
    baseRef.current = elapsed >= HEAT_MS ? 0 : elapsed;
    if (elapsed >= HEAT_MS) {
      setElapsed(0);
      tinkCountRef.current = 0;
    }
    startRef.current = performance.now();
    setRunning(true);
  };

  const pause = () => {
    if (timer.current) clearInterval(timer.current);
    setRunning(false);
  };

  const spark = () => {
    if (sessionSparks >= 3) return;
    addGritSpark();
    setSessionSparks((n) => n + 1);
    sounds.spark(soundOn);
    haptic(10);
    const id = Date.now();
    setFlyingSparks((s) => [...s, id]);
    setTimeout(() => setFlyingSparks((s) => s.filter((x) => x !== id)), 1400);
  };

  if (!open) return null;

  const stage = Math.min(5, Math.floor(elapsed / TINK_EVERY)); // 0..5
  const glow = 0.25 + stage * 0.15;
  const mm = Math.floor(elapsed / 60000);
  const ss = Math.floor((elapsed % 60000) / 1000);
  const swordness = Math.min(1, elapsed / HEAT_MS); // 0 lump -> 1 blade

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "radial-gradient(circle at 50% 65%, #2a1206 0%, #120704 70%)" }}>
      {/* embers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="absolute bottom-24 rounded-full bg-orange-400 animate-driftUp"
            style={{
              left: `${8 + Math.random() * 84}%`,
              width: 3 + Math.random() * 3,
              height: 3 + Math.random() * 3,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      <div className="safe-top flex items-center justify-between px-5">
        <div className="text-orange-200/80 text-sm tracking-widest uppercase">The Forge</div>
        <button onClick={onClose} className="text-orange-100/70 text-sm px-3 py-1 rounded-full bg-white/5">
          Close
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* the ingot / blade */}
        <div className="relative flex items-center justify-center" style={{ height: 220 }}>
          <div
            className="rounded-lg"
            style={{
              width: 54 + swordness * 12,
              height: 120 + swordness * 40,
              clipPath: swordness > 0.4
                ? "polygon(50% 0%, 68% 12%, 62% 100%, 38% 100%, 32% 12%)"
                : "polygon(20% 8%, 80% 8%, 74% 92%, 26% 92%)",
              background: `linear-gradient(180deg, rgba(255,${160 + stage * 15},80,${glow + 0.2}) 0%, rgba(255,110,40,${glow}) 60%, rgba(120,40,20,0.9) 100%)`,
              boxShadow: `0 0 ${20 + stage * 12}px rgba(255,140,50,${glow}), inset 0 0 20px rgba(255,220,120,${glow})`,
              transition: "all 0.8s ease",
              transform: struck ? "scaleY(0.94) scaleX(1.06)" : "none",
            }}
          />
        </div>

        <div className="mt-6 font-mono text-4xl text-orange-100 tabular-nums">
          {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
        </div>
        <div className="text-orange-200/60 text-xs mt-1">
          {elapsed >= HEAT_MS ? "Struck. The blade is more sword-shaped than it was." : `Heat ${stage}/5 · a tink every 5 minutes`}
        </div>

        {/* controls */}
        <div className="mt-8 flex gap-3">
          {!running ? (
            <button
              onClick={light}
              className="px-6 py-3 rounded-full bg-orange-500 text-white font-medium ember-glow active:scale-95 transition"
            >
              {elapsed === 0 || elapsed >= HEAT_MS ? "🔥 Light the Forge" : "Resume heat"}
            </button>
          ) : (
            <button onClick={pause} className="px-6 py-3 rounded-full bg-white/10 text-orange-100 active:scale-95 transition">
              Pause
            </button>
          )}
        </div>

        {/* Grit Spark — the boredom button */}
        <div className="mt-10 w-full max-w-sm relative">
          <button
            onClick={spark}
            disabled={sessionSparks >= 3}
            className={`w-full rounded-2xl py-4 px-4 text-center border transition active:scale-[0.98] ${
              sessionSparks >= 3
                ? "border-white/10 bg-white/5 text-white/40"
                : "border-orange-300/40 bg-orange-400/10 text-orange-50"
            }`}
          >
            <div className="text-sm font-medium">“This is boring and I&apos;m doing it anyway.”</div>
            <div className="text-[11px] text-orange-200/60 mt-1">
              {sessionSparks >= 3
                ? "3 sparks this session — that's honest enough. Back to work."
                : `Mints a Grit Spark · ${3 - sessionSparks} left this session`}
            </div>
          </button>

          {/* flying sparks toward the bowl */}
          {flyingSparks.map((id) => (
            <span
              key={id}
              className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-white"
              style={{
                boxShadow: "0 0 10px 3px rgba(255,210,120,0.9)",
                animation: "driftUp 1.4s ease-out forwards",
              }}
            />
          ))}
        </div>

        <div className="mt-6 text-center text-orange-200/50 text-xs max-w-xs">
          Grit Sparks are the only thing that improves tonight&apos;s pour. Endured boredom becomes luck.
          <div className="mt-1 text-orange-100/70">Today: {today.forgeHeats} heats · {today.gritSparks} sparks</div>
        </div>
      </div>
    </div>
  );
}
