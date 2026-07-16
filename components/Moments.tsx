"use client";

import { useEffect, useState } from "react";
import { useSandhya } from "@/lib/store";
import { LetterMark } from "./Glyphs";

// The Three Twilights (Day 25 / 50 / 75) and the Threshold Letter (~Day 40).
const MILESTONES: Record<number, { title: string; sanskrit: string; body: string; scene: string }> = {
  25: {
    sanskrit: "Prātaḥ Sandhyā",
    title: "First Twilight",
    scene: "/scenes/day25.webp",
    body: "A third of the way across. The sky makes its first visible jump — violet floods in over indigo. The blade's core is forged. Look how far the light has come.",
  },
  50: {
    sanskrit: "Mādhyāhnika",
    title: "The High Crossing",
    scene: "/scenes/day50.webp",
    body: "The halfway sun. Everything you built is now more than half real. If the old shore is behind you now — thank it. It taught you to build boats.",
  },
  75: {
    sanskrit: "Sāyaṁ Sandhyā",
    title: "The Emergence",
    scene: "/scenes/day75.webp",
    body: "The sun clears the horizon. Full daylight for the first time in 75 days. The blade is finished. The Crossing is assembled. And the crossing was never the point — the person who can cross is. See you at first light, Ram.",
  },
};

const FAREWELL_FLAG = 1000; // stored in seenMilestones once shown

export default function Moments() {
  const { dayIndex, todayK, state, celebrate, markLetterReturned } = useSandhya();
  const [active, setActive] = useState<null | { kind: "milestone"; day: number } | { kind: "letter" } | { kind: "farewell" }>(null);

  useEffect(() => {
    if (!state.startDate) return;
    // farewell on the last working day at KPIT
    if (state.lastWorkingDay && state.lastWorkingDay === todayK && !state.seenMilestones.includes(FAREWELL_FLAG)) {
      setActive({ kind: "farewell" });
      return;
    }
    // milestone check
    for (const day of [75, 50, 25]) {
      if (dayIndex >= day && !state.seenMilestones.includes(day)) {
        setActive({ kind: "milestone", day });
        return;
      }
    }
    // threshold letter returns ~ Day 40
    if (dayIndex >= 40 && state.thresholdLetter && !state.thresholdLetterReturned) {
      setActive({ kind: "letter" });
    }
  }, [dayIndex, todayK, state.startDate, state.lastWorkingDay, state.seenMilestones, state.thresholdLetter, state.thresholdLetterReturned]);

  if (!active) return null;

  const close = () => {
    if (active.kind === "milestone") celebrate(active.day);
    if (active.kind === "letter") markLetterReturned();
    if (active.kind === "farewell") celebrate(FAREWELL_FLAG);
    setActive(null);
  };

  const isDay75 = active.kind === "milestone" && active.day === 75;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6" style={{ background: "rgba(10,8,26,0.82)", backdropFilter: "blur(6px)" }}>
      <div className="card max-w-sm w-full text-center overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(40,30,66,0.95), rgba(90,55,54,0.92))" }}>
        {active.kind === "farewell" ? (
          <>
            <div className="relative h-52 w-full">
              <img src="/scenes/farewell.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(40,30,66,0.95) 100%)" }} />
            </div>
            <div className="px-6 pb-6 -mt-6 relative">
              <div className="text-amber-100/80 text-xs tracking-[0.3em] uppercase">The old shore</div>
              <h2 className="font-serif text-2xl text-white mt-1 mb-3">Your last day at KPIT</h2>
              <p className="text-white/85 text-sm leading-relaxed">Thank the old shore. It taught you to build boats. The door closes gently behind you — and the horizon ahead is already warm.</p>
            </div>
          </>
        ) : active.kind === "milestone" ? (
          <>
            <div className="relative h-44 w-full">
              <img src={MILESTONES[active.day].scene} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(40,30,66,0.95) 100%)" }} />
            </div>
            <div className="px-6 pb-6 -mt-6 relative">
              <div className="text-amber-100/80 text-xs tracking-[0.3em] uppercase">{MILESTONES[active.day].sanskrit}</div>
              <h2 className="font-serif text-2xl text-white mt-1 mb-3">Day {active.day} · {MILESTONES[active.day].title}</h2>
              <p className="text-white/85 text-sm leading-relaxed">{MILESTONES[active.day].body}</p>
              {isDay75 && (
                <div className="flex items-end justify-center gap-6 mt-4">
                  <img src="/blade-full.webp" alt="the finished blade" className="h-28 w-auto" style={{ filter: "drop-shadow(0 0 12px rgba(255,180,90,0.5))" }} />
                  <img src="/temple-full.webp" alt="the raised temple" className="h-28 w-auto" style={{ filter: "drop-shadow(0 0 12px rgba(255,180,90,0.4))" }} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-6">
            <div className="flex justify-center mb-2"><LetterMark size={44} /></div>
            <h2 className="font-serif text-xl text-white mb-1">A letter across the threshold</h2>
            <p className="text-white/55 text-xs mb-4">Sealed on Day 1, in your own words. Opened now.</p>
            <p className="text-white/90 text-sm leading-relaxed font-serif whitespace-pre-line text-left bg-black/20 rounded-xl p-4">
              “{state.thresholdLetter}”
            </p>
          </div>
        )}
        <div className="px-6 pb-6">
          <button onClick={close} className="w-full px-6 py-2.5 rounded-full bg-white/15 text-white text-sm active:scale-95 transition">
            Continue the crossing
          </button>
        </div>
      </div>
    </div>
  );
}
