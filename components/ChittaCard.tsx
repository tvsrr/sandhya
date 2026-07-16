"use client";

import { haptic } from "@/lib/audio";
import { useSandhya } from "@/lib/store";
import type { StressMood } from "@/lib/types";

const MOODS: { key: StressMood; face: string; label: string }[] = [
  { key: "good", face: "🙂", label: "light" },
  { key: "ok", face: "😐", label: "even" },
  { key: "heavy", face: "😮‍💨", label: "heavy" },
];

export default function ChittaCard({ onFocus }: { onFocus: () => void }) {
  const { today, patchToday, setStress } = useSandhya();

  const setPages = (n: number) => {
    patchToday({ pagesRead: Math.max(0, n) });
    haptic(6);
  };

  const pagePct = Math.min(100, (today.pagesRead / 20) * 100);

  return (
    <section className="card p-4">
      <header className="mb-3">
        <h3 className="text-white font-medium tracking-wide">🌇 CHITTA · mind</h3>
        <p className="text-white/50 text-xs">Golden hour — 20 pages, journal, one breath of a stress check</p>
      </header>

      {/* reading */}
      <div className="rounded-2xl border border-white/15 bg-white/5 p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/85">📖 Pages read</span>
          <div className="flex items-center gap-2">
            <button onClick={onFocus} className="text-[11px] px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-50 active:scale-95">
              ▷ focus
            </button>
            <span className="text-sm text-amber-200 font-medium">{today.pagesRead} / 20</span>
          </div>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-3">
          <div className="h-full bg-gradient-to-r from-amber-300 to-orange-400" style={{ width: `${pagePct}%`, transition: "width .3s ease" }} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPages(today.pagesRead - 5)} className="w-10 h-9 rounded-lg bg-white/8 text-white/80 active:scale-95">
            −5
          </button>
          <button onClick={() => setPages(today.pagesRead - 1)} className="w-10 h-9 rounded-lg bg-white/8 text-white/80 active:scale-95">
            −1
          </button>
          <button onClick={() => setPages(today.pagesRead + 1)} className="flex-1 h-9 rounded-lg bg-white/10 text-white/80 active:scale-95">
            +1 page
          </button>
          <button onClick={() => setPages(today.pagesRead + 5)} className="w-12 h-9 rounded-lg bg-amber-400/20 border border-amber-300/30 text-amber-50 active:scale-95">
            +5
          </button>
        </div>
      </div>

      {/* journal */}
      <div className="mb-3">
        <label className="text-sm text-white/85 mb-1 block">🖋 Tonight&apos;s journal</label>
        <textarea
          value={today.journal}
          onChange={(e) => patchToday({ journal: e.target.value })}
          placeholder="Before bed. Even one honest line counts…"
          rows={3}
          className="w-full rounded-xl bg-white/8 border border-white/15 p-3 text-sm text-white placeholder-white/35 focus:outline-none focus:border-amber-200/50 resize-none font-serif"
        />
      </div>

      {/* stress check-in */}
      <div>
        <div className="text-sm text-white/85 mb-2">How heavy was the mind today?</div>
        <div className="grid grid-cols-3 gap-2">
          {MOODS.map((m) => (
            <button
              key={m.key}
              onClick={() => {
                setStress(m.key);
                haptic(8);
              }}
              className={`rounded-xl py-3 flex flex-col items-center border transition active:scale-95 ${
                today.stress === m.key ? "border-amber-200/50 bg-amber-300/15" : "border-white/10 bg-white/5"
              }`}
            >
              <span className="text-2xl">{m.face}</span>
              <span className="text-[11px] text-white/55 mt-1">{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
