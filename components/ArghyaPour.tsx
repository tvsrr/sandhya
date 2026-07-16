"use client";

import { useState } from "react";
import { haptic, sounds } from "@/lib/audio";
import { useSandhya } from "@/lib/store";
import type { RewardResult } from "@/lib/types";

// The last thing you do each night. Tilt (or tap-hold) to pour the day into the
// horizon. Something comes back — of variable magnitude, always meaning.
export default function ArghyaPour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pour, today, state } = useSandhya();
  const [phase, setPhase] = useState<"ready" | "pouring" | "reward">(today.poured ? "reward" : "ready");
  const [reward, setReward] = useState<RewardResult | null>(null);

  const doPour = () => {
    if (phase !== "ready") return;
    setPhase("pouring");
    sounds.pour(state.soundOn);
    haptic([0, 30, 60, 30]);
    const result = pour();
    setTimeout(() => {
      setReward(result);
      setPhase("reward");
    }, 1400);
  };

  if (!open) return null;

  const alreadyPoured = today.poured && !reward;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6" style={{ background: "linear-gradient(180deg, #1a1338 0%, #3a2540 60%, #6b3b3a 100%)" }}>
      <button onClick={onClose} className="absolute top-5 right-5 safe-top text-white/60 text-sm px-3 py-1 rounded-full bg-white/5">
        Close
      </button>

      <div className="text-center max-w-sm w-full">
        <div className="text-amber-100/70 text-xs tracking-[0.3em] uppercase mb-2">Arghya</div>

        {phase === "ready" && !alreadyPoured && (
          <>
            <h2 className="font-serif text-2xl text-white mb-1">Offer the day.</h2>
            <p className="text-white/60 text-sm mb-8">
              Everything today produced — your closed arcs, your heats, {today.gritSparks} grit sparks — rests in the bowl.
            </p>
            <button
              onClick={doPour}
              className="mx-auto mb-6 flex items-center justify-center active:scale-95 transition"
              style={{ width: 190, height: 190 }}
            >
              <img
                src="/bowl.webp"
                alt="offering bowl"
                className="w-full h-full object-contain"
                style={{ filter: "drop-shadow(0 6px 30px rgba(255,180,90,0.45))" }}
              />
            </button>
            <p className="text-amber-100/70 text-sm">Tap the bowl to pour it into the horizon.</p>
          </>
        )}

        {alreadyPoured && (
          <>
            <h2 className="font-serif text-2xl text-white mb-2">Already offered.</h2>
            <p className="text-white/60 text-sm">Tonight&apos;s pour is done. Rest now — the sun will rise on its own.</p>
          </>
        )}

        {phase === "pouring" && (
          <div className="py-16">
            <div className="mx-auto w-24 h-24 rounded-full animate-breathe" style={{ background: "radial-gradient(circle, #ffd98a 0%, rgba(255,150,80,0) 70%)" }} />
            <p className="text-amber-100/80 mt-6 text-sm">The offering catches light on the way down…</p>
          </div>
        )}

        {phase === "reward" && reward && (
          <div className="animate-[breathe_0.6s_ease]">
            <RewardCard reward={reward} />
            <button onClick={onClose} className="mt-8 px-6 py-2.5 rounded-full bg-white/10 text-white/85 text-sm active:scale-95 transition">
              Śubha rātri — good night
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RewardCard({ reward }: { reward: RewardResult }) {
  const accent =
    reward.kind === "thread"
      ? "from-yellow-200/30 to-amber-400/10 border-yellow-200/50"
      : reward.kind === "relic"
      ? "from-fuchsia-300/20 to-indigo-400/10 border-fuchsia-200/40"
      : reward.kind === "lamp"
      ? "from-amber-200/25 to-orange-400/10 border-amber-200/50"
      : "from-white/15 to-white/5 border-white/25";

  const glyph = reward.kind === "thread" ? "🧵" : reward.kind === "lamp" ? "diya" : "🌾";
  const relicSrc =
    reward.kind === "relic" && reward.relicId
      ? `/relics/relic-${String(((reward.relicId - 1) % 10) + 1).padStart(2, "0")}.webp`
      : null;

  return (
    <div className={`rounded-2xl border bg-gradient-to-b ${accent} p-5 text-left`}>
      {relicSrc && (
        <img
          src={relicSrc}
          alt=""
          className="w-40 mx-auto mb-4 rounded-lg shadow-2xl ring-1 ring-amber-200/40"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}
        />
      )}
      <div className="flex items-center gap-2 mb-2">
        {glyph === "diya" ? (
          <img src="/diya-lit.webp" alt="" className="h-6 w-auto" />
        ) : (
          <span className="text-2xl">{glyph}</span>
        )}
        <span className="text-white font-medium">{reward.title}</span>
      </div>
      <p className="text-white/85 text-sm whitespace-pre-line leading-relaxed">{reward.body}</p>
    </div>
  );
}
