"use client";

import { useEffect, useState } from "react";
import { useSandhya } from "@/lib/store";

// The Three Twilights (Day 25 / 50 / 75) and the Threshold Letter (~Day 40).
const MILESTONES: Record<number, { title: string; sanskrit: string; body: string }> = {
  25: {
    sanskrit: "Prātaḥ Sandhyā",
    title: "First Twilight",
    body: "A third of the way across. The sky makes its first visible jump — violet floods in over indigo. The blade's core is forged. Look how far the light has come.",
  },
  50: {
    sanskrit: "Mādhyāhnika",
    title: "The High Crossing",
    body: "The halfway sun. Everything you built is now more than half real. If the old shore is behind you now — thank it. It taught you to build boats.",
  },
  75: {
    sanskrit: "Sāyaṁ Sandhyā",
    title: "The Emergence",
    body: "The sun clears the horizon. Full daylight for the first time in 75 days. The blade is finished. The Crossing is assembled. And the crossing was never the point — the person who can cross is. See you at first light, Ram.",
  },
};

export default function Moments() {
  const { dayIndex, state, celebrate, markLetterReturned } = useSandhya();
  const [active, setActive] = useState<null | { kind: "milestone"; day: number } | { kind: "letter" }>(null);

  useEffect(() => {
    if (!state.startDate) return;
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
  }, [dayIndex, state.startDate, state.seenMilestones, state.thresholdLetter, state.thresholdLetterReturned]);

  if (!active) return null;

  const close = () => {
    if (active.kind === "milestone") celebrate(active.day);
    if (active.kind === "letter") markLetterReturned();
    setActive(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6" style={{ background: "rgba(10,8,26,0.82)", backdropFilter: "blur(6px)" }}>
      <div className="card p-6 max-w-sm w-full text-center" style={{ background: "linear-gradient(180deg, rgba(60,45,90,0.9), rgba(120,70,60,0.85))" }}>
        {active.kind === "milestone" ? (
          <>
            <div className="text-4xl mb-2">🌄</div>
            <div className="text-amber-100/70 text-xs tracking-[0.3em] uppercase">{MILESTONES[active.day].sanskrit}</div>
            <h2 className="font-serif text-2xl text-white mt-1 mb-3">Day {active.day} · {MILESTONES[active.day].title}</h2>
            <p className="text-white/85 text-sm leading-relaxed">{MILESTONES[active.day].body}</p>
          </>
        ) : (
          <>
            <div className="text-3xl mb-2">💌</div>
            <h2 className="font-serif text-xl text-white mb-1">A letter across the threshold</h2>
            <p className="text-white/55 text-xs mb-4">Sealed on Day 1, in your own words. Opened now.</p>
            <p className="text-white/90 text-sm leading-relaxed font-serif whitespace-pre-line text-left bg-black/20 rounded-xl p-4">
              “{state.thresholdLetter}”
            </p>
          </>
        )}
        <button onClick={close} className="mt-6 px-6 py-2.5 rounded-full bg-white/15 text-white text-sm active:scale-95 transition">
          Continue the crossing
        </button>
      </div>
    </div>
  );
}
