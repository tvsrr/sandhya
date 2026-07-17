"use client";

import { useSandhya } from "@/lib/store";
import { computeIdentities } from "@/lib/identity";
import RoomShell from "./RoomShell";

// The meaning behind every word in the app — so the ritual is understood, not mysterious.
const GLOSSARY: { term: string; sanskrit?: string; poetic: string; plain: string }[] = [
  {
    term: "SANDHYA",
    sanskrit: "sandhyā — the junction, the threshold",
    poetic: "The twilight seam where one thing becomes another. Your notice period is a 75-day sandhya between two lives.",
    plain: "The whole app is one sunrise stretched across 75 days. As your days-lit grow, the sky shifts indigo → violet → rose → amber → gold.",
  },
  {
    term: "The Sun Arc",
    poetic: "The sun's daily path from horizon to zenith.",
    plain: "Your day, in three segments — DEHA, KARMA, CHITTA. Close all three and the day's sun rises. It never starts at zero: showing up is already motion.",
  },
  {
    term: "DEHA",
    sanskrit: "deha — the body",
    poetic: "First light. The body honored before anything is asked of the mind.",
    plain: "Your morning ritual: the gym, and Sandhyavandanam — either order. Both wake-paths (Surya / Soma) earn identical credit.",
  },
  {
    term: "KARMA",
    sanskrit: "karma — action, craft",
    poetic: "The climbing sun. The work of forging the tools of your next life.",
    plain: "The 6-hour block: the C++ Forge, the Architect track, LeetCode sparring, and KPIT maintenance. Closes with a heat + architect + two spars.",
  },
  {
    term: "CHITTA",
    sanskrit: "chitta — the mind",
    poetic: "Golden hour. The day gathered, read, and set down.",
    plain: "20 pages read, tonight's journal, and one breath of a stress check-in. The inner life — the part that lasts.",
  },
  {
    term: "The Moon",
    poetic: "A waxing moon that fills across the week.",
    plain: "Your four health pillars — clean eating, 8k steps, morning weigh-in, in bed by 11 — as ONE weekly tap: held or slipped. A full week gifts a Ghee Lamp.",
  },
  {
    term: "The Forge & Grit Sparks",
    poetic: "Forges are hot and loud and repetitive — and that is exactly why what comes out of them is strong.",
    plain: "A 25-minute C++ heat with a soft anvil tink every 5 minutes. The “this is boring and I'm doing it anyway” button mints Grit Sparks — the ONLY thing that improves your nightly reward. Endured boredom becomes luck.",
  },
  {
    term: "Arghya & the Bowl",
    sanskrit: "arghya — the offering of water to the sun",
    poetic: "The last thing you do each night: pour the day into the horizon, and something comes back.",
    plain: "A variable reward — a line from your own past journal, a verse, a real stat, a Ghee Lamp, or a rare Relic card. Nothing is currency; every reward is meaning.",
  },
  {
    term: "Lamps, not streaks",
    poetic: "Chains break. Light accumulates.",
    plain: "The number that matters is “days lit,” which only grows — never a streak that shatters. A Ghee Lamp covers a missed day. A slipped day is a dim blue ember, never red. The dawn does not restart.",
  },
  {
    term: "The Path — Blade & Temple",
    poetic: "Dry lessons become geology — layers you can point at.",
    plain: "Your two nanodegrees. Each C++ course forges a piece of a Blade; each Architect course raises a tier of a Temple. Check off lessons and watch them take form.",
  },
  {
    term: "The Three Twilights",
    poetic: "Sandhyavandanam is performed three times a day; your crossing has three.",
    plain: "Milestones at Day 25 (First Twilight), Day 50 (High Crossing), and Day 75 (the Emergence) — plus a Threshold Letter you wrote on Day 1 that returns to you around Day 40.",
  },
  {
    term: "Who you're becoming",
    poetic: "Every action is a vote for the person you wish to become.",
    plain: "Each rep is credited to a future self — Fitter, Architect, Engineer, Centered Ram. The crossing was never the point. The person who can cross is.",
  },
];

export default function TheJourney({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useSandhya();
  const identities = computeIdentities(state);

  return (
    <RoomShell open={open} title="The Journey" subtitle="who you're becoming · what it means" onClose={onClose}>
      {/* WHO YOU'RE BECOMING */}
      <div className="mb-2">
        <h3 className="text-white/90 font-serif text-lg">Who you&apos;re becoming</h3>
        <p className="text-[11px] text-white/45 italic font-serif">Every action is a vote. Watch each muscle gear up.</p>
      </div>
      <div className="space-y-2.5 mb-8">
        {identities.map((id) => (
          <div key={id.id} className="rounded-2xl border border-white/12 bg-white/5 p-4">
            <div className="flex items-baseline justify-between">
              <div className="text-white font-serif text-[15px]">{id.name}</div>
              <div className="text-[11px] text-amber-200/90">
                {id.votes} {id.votes === 1 ? "vote" : "votes"} · {id.stage}
              </div>
            </div>
            <div className="text-[11px] text-white/50 mb-2">{id.tagline}</div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400"
                style={{ width: `${Math.max(3, id.progress * 100)}%`, transition: "width .5s ease" }}
              />
            </div>
            <p className="text-[11px] text-white/45 mt-2 leading-relaxed">{id.why}</p>
            <p className="text-[10px] text-white/35 mt-1">fed by: {id.feeds}</p>
          </div>
        ))}
      </div>

      {/* THE MEANING */}
      <div className="mb-2">
        <h3 className="text-white/90 font-serif text-lg">The meaning</h3>
        <p className="text-[11px] text-white/45 italic font-serif">What each word in the temple refers to.</p>
      </div>
      <div className="space-y-2.5 pb-4">
        {GLOSSARY.map((g) => (
          <div key={g.term} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-white font-serif text-[15px]">{g.term}</div>
            {g.sanskrit && <div className="text-[11px] text-amber-200/70 italic">{g.sanskrit}</div>}
            <p className="text-[12px] text-white/70 font-serif italic mt-1.5 leading-relaxed">{g.poetic}</p>
            <p className="text-[12px] text-white/55 mt-1.5 leading-relaxed">{g.plain}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-white/30 text-xs font-serif italic pb-2">The threshold is the temple.</p>
    </RoomShell>
  );
}
