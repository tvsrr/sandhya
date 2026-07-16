"use client";

import { useState } from "react";
import { haptic } from "@/lib/audio";
import { useSandhya } from "@/lib/store";

export default function KarmaCard({ onOpenForge }: { onOpenForge: () => void }) {
  const { today, patchToday, logLeet, state } = useSandhya();
  const [logging, setLogging] = useState(false);

  const toggle = (key: "architect" | "kpit") => {
    patchToday({ [key]: !today[key] } as any);
    haptic(8);
  };

  const doLog = (difficulty: "easy" | "medium" | "hard", usedHints: boolean) => {
    logLeet(difficulty, usedHints);
    haptic(10);
    setLogging(false);
  };

  return (
    <section className="card p-4">
      <header className="mb-3">
        <h3 className="text-white font-medium tracking-wide">☀️ KARMA · craft</h3>
        <p className="text-white/50 text-xs">The 6-hour block, honored. Mentoring your replacement counts here too.</p>
      </header>

      {/* Forge */}
      <button
        onClick={onOpenForge}
        className="w-full rounded-2xl py-3 px-4 mb-2 flex items-center justify-between border border-orange-300/40 bg-gradient-to-r from-orange-500/20 to-orange-400/5 active:scale-[0.99] transition"
      >
        <div className="text-left">
          <div className="text-sm text-orange-50 font-medium">🔥 The Forge — C++</div>
          <div className="text-[11px] text-orange-200/60">
            {today.forgeHeats} heats · {today.gritSparks} grit sparks today
          </div>
        </div>
        <span className="text-orange-100/80 text-sm">Enter →</span>
      </button>

      <button
        onClick={() => toggle("architect")}
        className={`w-full rounded-2xl py-3 px-4 mb-2 flex items-center justify-between border transition active:scale-[0.99] ${
          today.architect ? "bg-amber-300/15 border-amber-200/40" : "bg-white/5 border-white/15"
        }`}
      >
        <span className="text-sm text-white/85">📐 Architect track</span>
        <span className="text-lg">{today.architect ? "✅" : "○"}</span>
      </button>

      {/* Sparring ring — LeetCode */}
      <div className="rounded-2xl border border-white/15 bg-white/5 p-3 mb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white/85">⚔️ Sparring · LeetCode</div>
            <div className="text-[11px] text-white/50">
              {today.leetSolved}/2 solved · Craft Rating <span className="text-amber-200 font-medium">{state.craftRating}</span>
            </div>
          </div>
          <button
            onClick={() => setLogging((v) => !v)}
            className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white/80 active:scale-95"
          >
            {logging ? "Cancel" : "Log a spar"}
          </button>
        </div>

        {logging && (
          <div className="mt-3 space-y-2">
            <div className="text-[11px] text-white/50">Difficulty — solved clean, or with hints?</div>
            {(["easy", "medium", "hard"] as const).map((d) => (
              <div key={d} className="flex gap-2">
                <button
                  onClick={() => doLog(d, false)}
                  className="flex-1 rounded-lg py-2 text-xs bg-emerald-400/15 border border-emerald-300/30 text-emerald-50 active:scale-95"
                >
                  {d} · clean
                </button>
                <button
                  onClick={() => doLog(d, true)}
                  className="flex-1 rounded-lg py-2 text-xs bg-white/8 border border-white/15 text-white/70 active:scale-95"
                >
                  {d} · used hints
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => toggle("kpit")}
        className={`w-full rounded-2xl py-3 px-4 flex items-center justify-between border transition active:scale-[0.99] ${
          today.kpit ? "bg-amber-300/15 border-amber-200/40" : "bg-white/5 border-white/15"
        }`}
      >
        <span className="text-sm text-white/85">🧭 KPIT maintenance (~2h) — meetings, mentoring, slides</span>
        <span className="text-lg">{today.kpit ? "✅" : "○"}</span>
      </button>

      <p className="text-[11px] text-white/40 mt-2">
        Segment closes with a forge heat + architect + both spars. RAII isn&apos;t syntax — it&apos;s your first lesson in
        systems that clean up after themselves.
      </p>
    </section>
  );
}
