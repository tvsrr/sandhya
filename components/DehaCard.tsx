"use client";

import { haptic, sounds } from "@/lib/audio";
import { useSandhya } from "@/lib/store";
import HoldButton from "./HoldButton";

// DEHA — first light. Morning ritual complete, either order. Two ragas, identical credit.
export default function DehaCard() {
  const { today, patchToday, setWakePath, state } = useSandhya();
  const path = today.wakePath;

  const toggleGym = () => {
    patchToday({ gym: !today.gym });
    haptic(8);
    if (!today.gym) sounds.bowl(state.soundOn);
  };

  return (
    <section className="card p-4">
      <header className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-medium tracking-wide">🌅 DEHA · body</h3>
          <p className="text-white/50 text-xs">First light — gym & Sandhyavandanam, either order</p>
        </div>
      </header>

      {/* raga choice */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => {
            setWakePath("surya");
            sounds.bird(state.soundOn);
          }}
          className={`rounded-xl px-3 py-2 text-left border transition ${
            path === "surya" ? "border-indigo-200/50 bg-indigo-300/15" : "border-white/10 bg-white/5"
          }`}
        >
          <div className="text-sm text-white">☀️ Surya Path</div>
          <div className="text-[11px] text-white/50">woke 5–6 AM · gym → sandhya</div>
        </button>
        <button
          onClick={() => {
            setWakePath("soma");
            sounds.tanpura(state.soundOn);
          }}
          className={`rounded-xl px-3 py-2 text-left border transition ${
            path === "soma" ? "border-amber-200/50 bg-amber-300/15" : "border-white/10 bg-white/5"
          }`}
        >
          <div className="text-sm text-white">🌤 Soma Path</div>
          <div className="text-[11px] text-white/50">woke later · sandhya by 9 → gym</div>
        </button>
      </div>

      <div className="space-y-2">
        <button
          onClick={toggleGym}
          className={`w-full rounded-2xl py-3 px-4 flex items-center justify-between border transition active:scale-[0.99] ${
            today.gym ? "bg-amber-300/15 border-amber-200/40" : "bg-white/5 border-white/15"
          }`}
        >
          <span className="text-sm text-white/85">🏋️ Gym</span>
          <span className="text-lg">{today.gym ? "✅" : "○"}</span>
        </button>

        <HoldButton
          done={today.sandhya}
          onComplete={() => patchToday({ sandhya: true })}
          label="Hold to offer Sandhyavandanam"
          doneLabel="Sandhyavandanam offered"
        />
      </div>
    </section>
  );
}
