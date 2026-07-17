"use client";

import { useState } from "react";
import { useSandhya, todayKey } from "@/lib/store";
import { labelForProgress } from "@/lib/sky";
import SkyBackground from "./SkyBackground";
import SunArc from "./SunArc";
import Door, { type DoorState } from "./Door";
import { SunMark, AnvilMark, BookMark, PathMark, FlameMark } from "./Glyphs";
import Bowl from "./Bowl";
import RoomShell from "./RoomShell";
import Sheet from "./Sheet";
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

type View = "sky" | "deha" | "karma" | "chitta" | "crossing";

function doorState(count: number, total: number): DoorState {
  if (count >= total) return "lit";
  if (count > 0) return "stirring";
  return "unlit";
}

// how much of this week's moon is held (for the mini-moon in the sky)
function weekHeld(pillars: Record<string, "held" | "slipped">): number {
  const now = new Date();
  const dow = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - dow);
  let held = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    if (pillars[todayKey(d)] === "held") held++;
  }
  return held;
}

export default function Dashboard() {
  const { today, dayIndex, progress, segmentsToday, state, toggleSound } = useSandhya();
  const [view, setView] = useState<View>("sky");
  const [focus, setFocus] = useState<{ open: boolean; tag: FocusTag }>({ open: false, tag: "cpp" });
  const [path, setPath] = useState(false);
  const [pour, setPour] = useState(false);
  const [settings, setSettings] = useState(false);
  const [moon, setMoon] = useState(false);
  const openFocus = (tag: FocusTag) => setFocus({ open: true, tag });

  // completion (unchanged conditions)
  const dehaCount = (today.gym ? 1 : 0) + (today.sandhya ? 1 : 0);
  const karmaCount = (today.forgeHeats >= 1 ? 1 : 0) + (today.architect ? 1 : 0) + (today.leetSolved >= 2 ? 1 : 0);
  const chittaCount = (today.pagesRead >= 20 ? 1 : 0) + (today.journal.trim().length > 0 ? 1 : 0) + (today.stress ? 1 : 0);
  const deha = dehaCount === 2;
  const karma = karmaCount === 3;
  const chitta = chittaCount === 3;
  const allClosed = deha && karma && chitta;

  const moonIllum = weekHeld(state.weekPillars) / 7;

  return (
    <>
      <SkyBackground progress={progress} segmentsToday={segmentsToday} />

      {/* ===================== HOME · THE SKY ===================== */}
      <main className="min-h-screen max-w-md mx-auto px-4 safe-top safe-bottom flex flex-col">
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

        {/* the sky: arc hero + moon living in it */}
        <div className="relative mt-2">
          {/* the moon, top-right, at its waxing phase */}
          <button
            onClick={() => setMoon(true)}
            className="absolute right-2 top-0 w-11 h-11 rounded-full bg-white/8 overflow-hidden border border-white/15"
            aria-label="the moon — weekly pillars"
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-amber-50 to-ghee"
              style={{ clipPath: `inset(0 ${(1 - moonIllum) * 100}% 0 0)`, transition: "clip-path .5s ease" }}
            />
          </button>

          <SunArc dayIndex={dayIndex} deha={deha} karma={karma} chitta={chitta} />
        </div>

        {/* the bowl on the horizon */}
        <div className="mb-5 mt-1">
          <Bowl fill={segmentsToday / 3} full={allClosed} poured={today.poured} onClick={() => setPour(true)} />
        </div>

        {/* three doors */}
        <div className="flex gap-2.5">
          <Door
            glyph={<SunMark size={38} />}
            name="DEHA"
            state={doorState(dehaCount, 2)}
            status={deha ? "offered" : dehaCount === 1 ? "1 of 2" : "at rest"}
            onClick={() => setView("deha")}
          />
          <Door
            glyph={<AnvilMark size={38} />}
            name="KARMA"
            state={doorState(karmaCount, 3)}
            status={karma ? "forged" : `${karmaCount} of 3`}
            onClick={() => setView("karma")}
          />
          <Door
            glyph={<BookMark size={38} />}
            name="CHITTA"
            state={doorState(chittaCount, 3)}
            status={chitta ? "at peace" : `${chittaCount} of 3`}
            onClick={() => setView("chitta")}
          />
        </div>

        {/* two quiet emblems */}
        <div className="flex items-center justify-between mt-auto pt-6 pb-4 text-white/55">
          <button onClick={() => setPath(true)} className="flex items-center gap-1.5 text-xs tracking-wide active:scale-95">
            <PathMark size={22} /> The Path
          </button>
          <p className="text-[10px] text-white/25 font-serif italic">the threshold is the temple</p>
          <button onClick={() => setView("crossing")} className="flex items-center gap-1.5 text-xs tracking-wide active:scale-95">
            The Crossing <FlameMark size={22} />
          </button>
        </div>
      </main>

      {/* ===================== ROOMS ===================== */}
      <RoomShell open={view === "deha"} title="DEHA · body" subtitle="first light" onClose={() => setView("sky")}>
        <DehaCard />
      </RoomShell>

      <RoomShell open={view === "karma"} title="KARMA · craft" subtitle="the forge courtyard" onClose={() => setView("sky")}>
        <KarmaCard onFocus={openFocus} onOpenPath={() => setPath(true)} />
      </RoomShell>

      <RoomShell open={view === "chitta"} title="CHITTA · mind" subtitle="golden hour" onClose={() => setView("sky")}>
        <ChittaCard onFocus={() => openFocus("read")} />
      </RoomShell>

      <RoomShell open={view === "crossing"} title="The Crossing" subtitle="seventy-five dawns" onClose={() => setView("sky")}>
        <DaysLit />
        <p className="text-center text-white/30 text-xs font-serif italic mt-6">The grind is the transformation.</p>
      </RoomShell>

      {/* ===================== SHEETS / OVERLAYS ===================== */}
      <Sheet open={moon} onClose={() => setMoon(false)}>
        <MoonWeek />
      </Sheet>

      <Pomodoro open={focus.open} initialTag={focus.tag} onClose={() => setFocus((f) => ({ ...f, open: false }))} />
      <Path open={path} onClose={() => setPath(false)} />
      {pour && <ArghyaPour open={pour} onClose={() => setPour(false)} />}
      <Settings open={settings} onClose={() => setSettings(false)} />
      <Moments />
    </>
  );
}
