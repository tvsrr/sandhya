"use client";

import { segmentsClosed } from "@/lib/rewards";
import { todayKey, useSandhya } from "@/lib/store";
import { TOTAL_DAYS } from "@/lib/sky";

// Chains break. Light accumulates. The metric that matters is always "days lit",
// never "current streak." A total can only grow.
export default function DaysLit() {
  const { state, daysLit, dayIndex } = useSandhya();
  if (!state.startDate) return null;

  const [sy, sm, sd] = state.startDate.split("-").map(Number);
  const start = new Date(sy, sm - 1, sd);
  const tk = todayKey();

  const flames = Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = todayKey(d);
    const rec = state.days[key];
    const isFuture = i + 1 > dayIndex;
    const isToday = key === tk;
    let type: "lit" | "lamp" | "dim" | "future" | "today" = "future";
    if (isFuture) type = "future";
    else if (rec && segmentsClosed(rec) === 3) type = "lit";
    else if (rec && rec.lampBurned) type = "lamp";
    else type = "dim";
    if (isToday && type !== "lit") type = "today";
    return { i, type, key };
  });

  return (
    <section className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium tracking-wide">The Crossing so far</h3>
        <div className="text-right">
          <div className="text-amber-200 font-medium text-sm">days lit: {daysLit} of {Math.max(0, dayIndex)}</div>
          <div className="text-[11px] text-white/45">lamps banked: {state.lamps} · relics: {state.relics.length}/75</div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(15,1fr)] gap-1.5">
        {flames.map((f) => (
          <div
            key={f.i}
            title={`Day ${f.i + 1}`}
            className="aspect-square rounded-[4px] flex items-center justify-center text-[9px]"
            style={{
              background:
                f.type === "lit"
                  ? "linear-gradient(180deg,#ffd27a,#ff8c42)"
                  : f.type === "lamp"
                  ? "rgba(255,207,107,0.35)"
                  : f.type === "today"
                  ? "rgba(255,255,255,0.22)"
                  : f.type === "dim"
                  ? "rgba(90,110,190,0.35)"
                  : "rgba(255,255,255,0.06)",
              boxShadow: f.type === "lit" ? "0 0 6px rgba(255,150,70,0.6)" : "none",
              border: f.type === "today" ? "1px solid rgba(255,220,150,0.7)" : "none",
            }}
          >
            {f.type === "lamp" ? "🪔" : ""}
          </div>
        ))}
      </div>

      <p className="text-[11px] text-white/40 mt-3">
        Dim days are blue embers, not dead. The dawn does not restart. The sun you&apos;ve raised stays raised.
      </p>
    </section>
  );
}
