"use client";

import { haptic } from "@/lib/audio";
import { todayKey, useSandhya } from "@/lib/store";

// The Moon is weekly, and only weekly. Four health pillars = ONE waxing moon.
// The app never asks what you ate. One tap. Done.
function weekDates(): string[] {
  const now = new Date();
  const dow = (now.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return todayKey(d);
  });
}

const DOW = ["M", "T", "W", "T", "F", "S", "S"];

export default function MoonWeek() {
  const { state, markPillar } = useSandhya();
  const week = weekDates();
  const tk = todayKey();
  const held = week.filter((d) => state.weekPillars[d] === "held").length;
  const illum = held / 7;
  const todayMark = state.weekPillars[tk];

  return (
    <section className="card p-4">
      <header className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-medium tracking-wide">🌙 The Moon · weekly</h3>
          <p className="text-white/50 text-xs">Clean eating · 8k steps · morning weigh-in · in bed by 11</p>
        </div>
        {/* waxing moon */}
        <div className="relative w-11 h-11 rounded-full bg-white/10 overflow-hidden border border-white/15">
          <div
            className="absolute inset-0 bg-gradient-to-br from-amber-100 to-ghee"
            style={{ clipPath: `inset(0 ${(1 - illum) * 100}% 0 0)`, transition: "clip-path .5s ease" }}
          />
        </div>
      </header>

      <div className="flex items-center justify-between gap-1 mb-3">
        {week.map((d, i) => {
          const m = state.weekPillars[d];
          const isToday = d === tk;
          return (
            <div key={d} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border ${
                  m === "held"
                    ? "bg-ghee/80 border-ghee text-indigo-950"
                    : m === "slipped"
                    ? "bg-white/5 border-white/15 text-white/30"
                    : "bg-white/5 border-white/10 text-white/40"
                } ${isToday ? "ring-2 ring-amber-200/60" : ""}`}
              >
                {m === "held" ? "●" : m === "slipped" ? "·" : ""}
              </div>
              <span className="text-[10px] text-white/40">{DOW[i]}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            markPillar("held");
            haptic(8);
          }}
          className={`rounded-xl py-2.5 text-sm border transition active:scale-95 ${
            todayMark === "held" ? "bg-ghee/25 border-ghee/50 text-amber-50" : "bg-white/5 border-white/15 text-white/75"
          }`}
        >
          Today: held ●
        </button>
        <button
          onClick={() => {
            markPillar("slipped");
            haptic(8);
          }}
          className={`rounded-xl py-2.5 text-sm border transition active:scale-95 ${
            todayMark === "slipped" ? "bg-white/10 border-white/25 text-white/70" : "bg-white/5 border-white/15 text-white/75"
          }`}
        >
          Today: slipped ·
        </button>
      </div>
      {held === 7 && (
        <p className="text-[11px] text-ghee/90 mt-2 text-center">Full moon this week — a Ghee Lamp is yours. 🪔</p>
      )}
    </section>
  );
}
