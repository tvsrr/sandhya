"use client";

import { haptic, sounds } from "@/lib/audio";
import { useSandhya } from "@/lib/store";
import HoldButton from "./HoldButton";

// DEHA — first light. Morning ritual, either order. Two ragas, identical credit.
export default function DehaCard() {
  const { today, patchToday, setWakePath, state } = useSandhya();
  const path = today.wakePath;

  const toggleGym = () => {
    patchToday({ gym: !today.gym });
    haptic(8);
    if (!today.gym) sounds.bowl(state.soundOn);
  };

  return (
    <div className="pt-1 space-y-3.5">
      <p className="text-[11px] text-white/45 font-serif italic">Wake how you woke — both paths are complete music.</p>

      {/* raga choice */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            setWakePath("surya");
            sounds.bird(state.soundOn);
          }}
          className={`rounded-2xl px-4 py-4 text-left border transition active:scale-[0.98] ${
            path === "surya" ? "border-indigo-200/50 bg-indigo-300/15" : "border-white/12 bg-white/5"
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-300 mb-2" style={{ boxShadow: "0 0 8px rgba(150,170,255,0.7)" }} />
          <div className="text-sm text-white font-serif">Surya</div>
          <div className="text-[11px] text-white/50 mt-0.5">woke 5–6 AM · gym, then sandhya</div>
        </button>
        <button
          onClick={() => {
            setWakePath("soma");
            sounds.tanpura(state.soundOn);
          }}
          className={`rounded-2xl px-4 py-4 text-left border transition active:scale-[0.98] ${
            path === "soma" ? "border-amber-200/50 bg-amber-300/15" : "border-white/12 bg-white/5"
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-amber-300 mb-2" style={{ boxShadow: "0 0 8px rgba(255,200,120,0.7)" }} />
          <div className="text-sm text-white font-serif">Soma</div>
          <div className="text-[11px] text-white/50 mt-0.5">woke later · sandhya by 9, then gym</div>
        </button>
      </div>

      {/* gym */}
      <div
        onClick={toggleGym}
        className={`rounded-2xl px-4 py-3.5 flex items-center justify-between border cursor-pointer active:scale-[0.99] transition ${
          today.gym ? "bg-amber-300/12 border-amber-200/40" : "bg-white/5 border-white/12"
        }`}
      >
        <div>
          <div className="text-sm text-white/90">The gym stone</div>
          <div className="text-[10px] text-white/45">move the body first</div>
        </div>
        <span
          className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
            today.gym ? "bg-amber-300 border-amber-300 text-indigo-950" : "border-white/30 text-transparent"
          }`}
        >
          ✓
        </span>
      </div>

      {/* Sandhyavandanam — the one deliberately slow interaction */}
      <div>
        <p className="text-[11px] text-white/45 mb-1.5 px-1">The water — offered slowly, held for three breaths.</p>
        <HoldButton
          done={today.sandhya}
          onComplete={() => patchToday({ sandhya: true })}
          label="Hold to offer Sandhyavandanam"
          doneLabel="Sandhyavandanam offered"
        />
      </div>
    </div>
  );
}
