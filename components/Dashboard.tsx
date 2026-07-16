"use client";

import { useState } from "react";
import { useSandhya } from "@/lib/store";
import { labelForProgress } from "@/lib/sky";
import SkyBackground from "./SkyBackground";
import SunArc from "./SunArc";
import DehaCard from "./DehaCard";
import KarmaCard from "./KarmaCard";
import ChittaCard from "./ChittaCard";
import MoonWeek from "./MoonWeek";
import DaysLit from "./DaysLit";
import Pomodoro from "./Pomodoro";
import Path from "./Path";
import ArghyaPour from "./ArghyaPour";
import Settings from "./Settings";
import Moments from "./Moments";
import type { FocusTag } from "@/lib/types";

export default function Dashboard() {
  const { today, dayIndex, progress, segmentsToday, state, toggleSound } = useSandhya();
  const [focus, setFocus] = useState<{ open: boolean; tag: FocusTag }>({ open: false, tag: "cpp" });
  const [path, setPath] = useState(false);
  const [pour, setPour] = useState(false);
  const [settings, setSettings] = useState(false);
  const openFocus = (tag: FocusTag) => setFocus({ open: true, tag });

  const deha = today.gym && today.sandhya;
  const karma = today.forgeHeats >= 1 && today.architect && today.leetSolved >= 2;
  const chitta = today.pagesRead >= 20 && today.journal.trim().length > 0 && !!today.stress;
  const allClosed = deha && karma && chitta;

  return (
    <>
      <SkyBackground progress={progress} segmentsToday={segmentsToday} />

      <main className="min-h-screen max-w-md mx-auto px-4 safe-top safe-bottom">
        {/* header */}
        <header className="flex items-center justify-between py-3">
          <div>
            <h1 className="font-serif text-xl text-white tracking-wide ink-shadow">SANDHYA</h1>
            <p className="text-[11px] text-white/60">{labelForProgress(dayIndex)}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={toggleSound} className="w-9 h-9 rounded-full bg-white/8 border border-white/12 flex items-center justify-center" aria-label="sound">
              <span className="text-sm">{state.soundOn ? "🔔" : "🔕"}</span>
            </button>
            <button onClick={() => setSettings(true)} className="w-9 h-9 rounded-full bg-white/8 border border-white/12 flex items-center justify-center" aria-label="settings">
              <span className="text-sm">⚙️</span>
            </button>
          </div>
        </header>

        {/* the arc */}
        <div className="mt-1 mb-3">
          <SunArc dayIndex={dayIndex} deha={deha} karma={karma} chitta={chitta} />
        </div>

        {/* pour the day */}
        <button
          onClick={() => setPour(true)}
          className={`w-full rounded-2xl py-3 mb-4 border transition active:scale-[0.99] ${
            today.poured
              ? "bg-white/5 border-white/10 text-white/50"
              : allClosed
              ? "bg-gradient-to-r from-amber-400/30 to-orange-500/20 border-amber-200/50 text-amber-50 ember-glow"
              : "bg-white/8 border-white/15 text-white/80"
          }`}
        >
          {today.poured ? "🪔 The day is offered · rest now" : allClosed ? "🪔 All three closed — offer the day" : "🪔 Offer the day (Arghya)"}
        </button>

        {/* loops */}
        <div className="space-y-4">
          <DehaCard />
          <KarmaCard onFocus={openFocus} onOpenPath={() => setPath(true)} />
          <ChittaCard onFocus={() => openFocus("read")} />
          <MoonWeek />
          <DaysLit />
        </div>

        <footer className="text-center py-8">
          <p className="text-white/40 text-xs font-serif italic">The grind is the transformation. 🔥</p>
          <p className="text-white/25 text-[10px] mt-1">The threshold is the temple.</p>
        </footer>
      </main>

      {/* floating focus launcher */}
      {!focus.open && !pour && (
        <button
          onClick={() => openFocus("cpp")}
          className="fixed bottom-5 right-4 z-40 w-14 h-14 rounded-full bg-orange-500 text-white text-xl flex items-center justify-center ember-glow active:scale-95 transition"
          aria-label="Focus timer"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          ▷
        </button>
      )}

      <Pomodoro open={focus.open} initialTag={focus.tag} onClose={() => setFocus((f) => ({ ...f, open: false }))} />
      <Path open={path} onClose={() => setPath(false)} />
      {pour && <ArghyaPour open={pour} onClose={() => setPour(false)} />}
      <Settings open={settings} onClose={() => setSettings(false)} />
      <Moments />
    </>
  );
}
