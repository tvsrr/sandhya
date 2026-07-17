"use client";

import { useState } from "react";
import { haptic } from "@/lib/audio";
import { useSandhya } from "@/lib/store";
import { CURRICULUM, trackProgress } from "@/lib/curriculum";
import { AnvilMark, PathMark } from "./Glyphs";
import type { FocusTag } from "@/lib/types";

// KARMA — the forge courtyard: one hero (the Forge), a few smaller stations.
export default function KarmaCard({ onFocus, onOpenPath }: { onFocus: (tag: FocusTag) => void; onOpenPath: () => void }) {
  const { today, patchToday, logLeet, state } = useSandhya();
  const [logging, setLogging] = useState(false);
  const cppP = trackProgress(CURRICULUM[0], state.curriculum);
  const archP = trackProgress(CURRICULUM[1], state.curriculum);

  const toggle = (key: "architect" | "kpit") => {
    patchToday({ [key]: !today[key] } as any);
    haptic(8);
  };
  const doLog = (difficulty: "easy" | "medium" | "hard", usedHints: boolean) => {
    logLeet(difficulty, usedHints);
    haptic(10);
    setLogging(false);
  };

  const StateDot = ({ on }: { on: boolean }) => (
    <span
      className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
        on ? "bg-amber-300 border-amber-300 text-indigo-950" : "border-white/30 text-transparent"
      }`}
    >
      ✓
    </span>
  );

  return (
    <div className="pt-1 space-y-3.5">
      {/* status + path */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-white/45 font-serif italic">a heat · architect · two spars closes the day</p>
        <button onClick={onOpenPath} className="flex items-center gap-1 text-[11px] text-amber-200/80 active:scale-95">
          <PathMark size={14} /> walk the Path →
        </button>
      </div>

      {/* HERO — the Forge */}
      <button
        onClick={() => onFocus("cpp")}
        className="relative w-full rounded-3xl p-5 text-left overflow-hidden border border-orange-300/40 active:scale-[0.99] transition"
        style={{
          background: "linear-gradient(135deg, rgba(255,140,66,0.28) 0%, rgba(120,45,20,0.15) 100%)",
          boxShadow: "0 0 30px rgba(255,120,50,0.18), inset 0 1px 0 rgba(255,210,150,0.25)",
        }}
      >
        <div className="pointer-events-none absolute -right-6 -top-6 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,160,80,0.35), rgba(255,160,80,0) 70%)" }} />
        <div className="relative flex items-center gap-3.5">
          <AnvilMark size={44} />
          <div className="flex-1">
            <div className="text-orange-50 font-serif text-xl leading-tight">The Forge</div>
            <div className="text-[11px] text-orange-200/70 mt-0.5">
              C++ · {today.forgeHeats} heats · {today.gritSparks} sparks today
            </div>
          </div>
          <span className="text-orange-100/90 text-sm whitespace-nowrap">Light&nbsp;→</span>
        </div>
      </button>

      {/* STATIONS */}
      <div className="grid grid-cols-2 gap-3">
        {/* Architect */}
        <div
          onClick={() => toggle("architect")}
          className={`relative rounded-2xl p-3.5 h-28 flex flex-col justify-between border cursor-pointer active:scale-[0.98] transition ${
            today.architect ? "bg-amber-300/12 border-amber-200/40" : "bg-white/5 border-white/12"
          }`}
        >
          <div className="flex items-center justify-between">
            <PathMark size={22} />
            <StateDot on={today.architect} />
          </div>
          <div>
            <div className="text-sm text-white/90">Architect</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFocus("arch");
              }}
              className="text-[10px] text-indigo-200/70 mt-0.5 active:scale-95"
            >
              ▷ focus a session
            </button>
          </div>
        </div>

        {/* Sparring */}
        <div
          onClick={() => setLogging((v) => !v)}
          className="relative rounded-2xl p-3.5 h-28 flex flex-col justify-between border border-white/12 bg-white/5 cursor-pointer active:scale-[0.98] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-emerald-200/90 text-lg leading-none">⚔</span>
            <span className="text-[11px] text-white/55">{today.leetSolved}/2</span>
          </div>
          <div>
            <div className="text-sm text-white/90">Sparring</div>
            <div className="text-[10px] text-white/50">
              Craft <span className="text-amber-200 font-medium">{state.craftRating}</span> · {logging ? "close" : "log a spar"}
            </div>
          </div>
        </div>
      </div>

      {/* log picker */}
      {logging && (
        <div className="rounded-2xl border border-white/12 bg-white/5 p-3 space-y-2">
          <div className="text-[11px] text-white/50">Solved clean, or with hints?</div>
          {(["easy", "medium", "hard"] as const).map((d) => (
            <div key={d} className="flex gap-2">
              <button onClick={() => doLog(d, false)} className="flex-1 rounded-lg py-2 text-xs bg-emerald-400/15 border border-emerald-300/30 text-emerald-50 active:scale-95">
                {d} · clean
              </button>
              <button onClick={() => doLog(d, true)} className="flex-1 rounded-lg py-2 text-xs bg-white/8 border border-white/15 text-white/70 active:scale-95">
                {d} · hints
              </button>
            </div>
          ))}
          <button onClick={() => onFocus("leet")} className="w-full rounded-lg py-2 text-xs bg-emerald-400/10 border border-emerald-300/25 text-emerald-100/80 active:scale-95">
            ▷ focus a sparring session
          </button>
        </div>
      )}

      {/* KPIT — the old shore */}
      <div
        onClick={() => toggle("kpit")}
        className={`rounded-2xl px-4 py-3 flex items-center justify-between border cursor-pointer active:scale-[0.99] transition ${
          today.kpit ? "bg-amber-300/12 border-amber-200/40" : "bg-white/5 border-white/12"
        }`}
      >
        <div>
          <div className="text-sm text-white/85">The old shore · KPIT</div>
          <div className="text-[10px] text-white/45">~2h — meetings, mentoring, slides</div>
        </div>
        <StateDot on={today.kpit} />
      </div>

      <p className="text-[11px] text-white/40 pt-1">
        RAII isn&apos;t syntax — it&apos;s your first lesson in systems that clean up after themselves. The two
        apprenticeships are one.
      </p>
    </div>
  );
}
