"use client";

import { useEffect, useRef, useState } from "react";
import { haptic, sounds } from "@/lib/audio";
import { useSandhya } from "@/lib/store";
import type { FocusTag } from "@/lib/types";

const TINK_EVERY = 5 * 60 * 1000;

const TAGS: { id: FocusTag; label: string; glyph: string; tint: string; forge: boolean }[] = [
  { id: "cpp", label: "C++ Forge", glyph: "🔥", tint: "#ff8c42", forge: true },
  { id: "arch", label: "Architect", glyph: "📐", tint: "#8aa2ff", forge: false },
  { id: "leet", label: "LeetCode", glyph: "⚔️", tint: "#5cd6a0", forge: false },
  { id: "read", label: "Reading", glyph: "📖", tint: "#ffcf6b", forge: false },
  { id: "kpit", label: "KPIT", glyph: "🧭", tint: "#b8c0d8", forge: false },
];

type Mode = "work" | "short" | "long";

export default function Pomodoro({
  open,
  initialTag = "cpp",
  onClose,
}: {
  open: boolean;
  initialTag?: FocusTag;
  onClose: () => void;
}) {
  const { state, completeHeat, addGritSpark, logFocus, setPomodoro, today } = useSandhya();
  const soundOn = state.soundOn;
  const P = state.pomodoro;

  const [tag, setTag] = useState<FocusTag>(initialTag);
  const [mode, setMode] = useState<Mode>("work");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [round, setRound] = useState(0);
  const [sessionSparks, setSessionSparks] = useState(0);
  const [struck, setStruck] = useState(false);
  const [flying, setFlying] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const startRef = useRef(0);
  const baseRef = useRef(0);
  const tinkRef = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (open) setTag(initialTag);
  }, [open, initialTag]);

  const meta = TAGS.find((t) => t.id === tag)!;
  const isForge = meta.forge;
  const durMs =
    (mode === "work" ? P.work : mode === "short" ? P.short : P.long) * 60 * 1000;

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      const e = baseRef.current + (performance.now() - startRef.current);
      setElapsed(e);
      if (mode === "work") {
        const tinks = Math.floor(e / TINK_EVERY);
        if (tinks > tinkRef.current && e < durMs) {
          tinkRef.current = tinks;
          sounds.tink(soundOn);
          haptic(8);
        }
      }
      if (e >= durMs) finish();
    }, 250);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode, durMs]);

  const finish = () => {
    if (timer.current) clearInterval(timer.current);
    setRunning(false);
    setElapsed(durMs);
    if (mode === "work") {
      logFocus(tag, P.work);
      if (isForge) completeHeat();
      setStruck(true);
      isForge ? sounds.hammer(soundOn) : sounds.bowl(soundOn);
      haptic([0, 60, 30, 120]);
      setTimeout(() => setStruck(false), 900);
      const nextRound = round + 1;
      setRound(nextRound);
      // auto-suggest a break
      const nextMode: Mode = nextRound % P.rounds === 0 ? "long" : "short";
      resetTo(nextMode);
    } else {
      sounds.pour(soundOn);
      resetTo("work");
    }
  };

  const resetTo = (m: Mode) => {
    setMode(m);
    setElapsed(0);
    baseRef.current = 0;
    tinkRef.current = 0;
    setRunning(false);
  };

  const start = () => {
    baseRef.current = elapsed >= durMs ? 0 : elapsed;
    if (elapsed >= durMs) {
      setElapsed(0);
      tinkRef.current = 0;
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
    setFlying((s) => [...s, id]);
    setTimeout(() => setFlying((s) => s.filter((x) => x !== id)), 1400);
  };

  if (!open) return null;

  const remaining = Math.max(0, durMs - elapsed);
  const mm = Math.floor(remaining / 60000);
  const ss = Math.floor((remaining % 60000) / 1000);
  const frac = durMs ? elapsed / durMs : 0;
  const stage = Math.min(5, Math.floor(elapsed / TINK_EVERY));
  const glow = 0.25 + stage * 0.15;
  const swordness = Math.min(1, frac);
  const isWork = mode === "work";

  const bg = isForge
    ? "radial-gradient(circle at 50% 65%, #2a1206 0%, #120704 70%)"
    : `radial-gradient(circle at 50% 60%, ${meta.tint}22 0%, #0e1030 70%)`;

  // circular progress ring for non-forge focus
  const RING = 2 * Math.PI * 54;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: bg }}>
      {isForge && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute bottom-24 rounded-full bg-orange-400 animate-driftUp"
              style={{ left: `${8 + Math.random() * 84}%`, width: 3 + Math.random() * 3, height: 3 + Math.random() * 3, animationDelay: `${Math.random() * 3}s`, opacity: 0.7 }}
            />
          ))}
        </div>
      )}

      <div className="safe-top flex items-center justify-between px-5">
        <div className="text-white/80 text-sm tracking-widest uppercase">{isWork ? "Focus" : mode === "long" ? "Long break" : "Break"}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSettings((v) => !v)} className="text-white/70 text-sm px-3 py-1 rounded-full bg-white/8">⚙</button>
          <button onClick={onClose} className="text-white/70 text-sm px-3 py-1 rounded-full bg-white/8">Close</button>
        </div>
      </div>

      {/* tag picker */}
      <div className="px-4 mt-2 flex gap-2 overflow-x-auto no-scrollbar">
        {TAGS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTag(t.id);
              resetTo("work");
              setRound(0);
            }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs border transition ${
              tag === t.id ? "text-white" : "text-white/55 border-white/12 bg-white/5"
            }`}
            style={tag === t.id ? { borderColor: `${t.tint}aa`, background: `${t.tint}22` } : {}}
          >
            {t.glyph} {t.label}
          </button>
        ))}
      </div>

      {showSettings && (
        <div className="mx-4 mt-3 card p-3 grid grid-cols-4 gap-2 text-center">
          {([
            ["Work", "work", P.work],
            ["Short", "short", P.short],
            ["Long", "long", P.long],
            ["Rounds", "rounds", P.rounds],
          ] as const).map(([label, key, val]) => (
            <div key={key}>
              <div className="text-[10px] text-white/45 uppercase mb-1">{label}</div>
              <div className="flex items-center justify-center gap-1">
                <button onClick={() => setPomodoro({ [key]: Math.max(1, (val as number) - 1) } as any)} className="w-6 h-6 rounded bg-white/10 text-white/70">−</button>
                <span className="text-white text-sm w-6 tabular-nums">{val}</span>
                <button onClick={() => setPomodoro({ [key]: (val as number) + 1 } as any)} className="w-6 h-6 rounded bg-white/10 text-white/70">+</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {isForge && isWork ? (
          <div className="relative flex items-center justify-center" style={{ height: 200 }}>
            <div
              className="rounded-lg"
              style={{
                width: 54 + swordness * 12,
                height: 120 + swordness * 40,
                clipPath: swordness > 0.4 ? "polygon(50% 0%, 68% 12%, 62% 100%, 38% 100%, 32% 12%)" : "polygon(20% 8%, 80% 8%, 74% 92%, 26% 92%)",
                background: `linear-gradient(180deg, rgba(255,${160 + stage * 15},80,${glow + 0.2}) 0%, rgba(255,110,40,${glow}) 60%, rgba(120,40,20,0.9) 100%)`,
                boxShadow: `0 0 ${20 + stage * 12}px rgba(255,140,50,${glow}), inset 0 0 20px rgba(255,220,120,${glow})`,
                transition: "all 0.8s ease",
                transform: struck ? "scaleY(0.94) scaleX(1.06)" : "none",
              }}
            />
          </div>
        ) : (
          <svg viewBox="0 0 130 130" width="200" height="200">
            <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
            <circle
              cx="65" cy="65" r="54" fill="none"
              stroke={isWork ? meta.tint : "#9fd8c0"}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={RING}
              strokeDashoffset={RING * (1 - frac)}
              transform="rotate(-90 65 65)"
              style={{ transition: "stroke-dashoffset .3s linear", filter: `drop-shadow(0 0 6px ${isWork ? meta.tint : "#9fd8c0"}88)` }}
            />
          </svg>
        )}

        <div className="mt-6 font-mono text-5xl text-white tabular-nums">
          {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
        </div>
        <div className="text-white/55 text-xs mt-1">
          {isWork
            ? isForge
              ? elapsed >= durMs ? "Struck. The blade is more sword-shaped than it was." : `Heat ${stage}/5 · round ${round + 1}`
              : `${meta.label} · round ${round + 1}`
            : "Rest your eyes. Look at something far away."}
        </div>

        <div className="mt-7 flex gap-3">
          {!running ? (
            <button onClick={start} className="px-7 py-3 rounded-full text-white font-medium active:scale-95 transition" style={{ background: meta.tint, boxShadow: `0 0 24px ${meta.tint}66` }}>
              {elapsed === 0 || elapsed >= durMs ? (isForge && isWork ? "🔥 Light the Forge" : "Start") : "Resume"}
            </button>
          ) : (
            <button onClick={pause} className="px-7 py-3 rounded-full bg-white/10 text-white active:scale-95 transition">Pause</button>
          )}
          {isWork && (
            <button onClick={() => resetTo("short")} className="px-4 py-3 rounded-full bg-white/8 text-white/70 text-sm active:scale-95">Skip to break</button>
          )}
          {!isWork && (
            <button onClick={() => resetTo("work")} className="px-4 py-3 rounded-full bg-white/8 text-white/70 text-sm active:scale-95">Skip break</button>
          )}
        </div>

        {/* Grit Spark — the boredom button (only during work) */}
        {isWork && (
          <div className="mt-9 w-full max-w-sm relative">
            <button
              onClick={spark}
              disabled={sessionSparks >= 3}
              className={`w-full rounded-2xl py-4 px-4 text-center border transition active:scale-[0.98] ${
                sessionSparks >= 3 ? "border-white/10 bg-white/5 text-white/40" : "border-white/25 bg-white/8 text-white/90"
              }`}
            >
              <div className="text-sm font-medium">&ldquo;This is boring and I&apos;m doing it anyway.&rdquo;</div>
              <div className="text-[11px] text-white/50 mt-1">
                {sessionSparks >= 3 ? "3 sparks this session — that's honest enough. Back to work." : `Mints a Grit Spark · ${3 - sessionSparks} left`}
              </div>
            </button>
            {flying.map((id) => (
              <span key={id} className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-white" style={{ boxShadow: "0 0 10px 3px rgba(255,210,120,0.9)", animation: "driftUp 1.4s ease-out forwards" }} />
            ))}
          </div>
        )}

        <div className="mt-6 text-center text-white/45 text-xs max-w-xs">
          Grit Sparks are the only thing that improves tonight&apos;s pour. Endured boredom becomes luck.
          <div className="mt-1 text-white/65">
            Today: {today.forgeHeats} forge heats · {today.gritSparks} sparks · {Object.values(today.focusLog ?? {}).reduce((a, b) => a + b, 0)} focus min
          </div>
        </div>
      </div>
    </div>
  );
}
