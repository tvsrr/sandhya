"use client";

import { useState } from "react";
import { haptic, sounds } from "@/lib/audio";
import { useSandhya } from "@/lib/store";
import { CURRICULUM, courseProgress, trackProgress, type Track } from "@/lib/curriculum";

// The Path of Mastery — both nanodegrees as structured, checkable curricula.
// C++ forges The Blade (4 components); Architect raises The Temple (4 tiers).
export default function Path({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useSandhya();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[55] flex justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-md h-full overflow-y-auto safe-top safe-bottom px-4 py-5"
        style={{ background: "linear-gradient(180deg,#12142f,#241a30)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-serif text-xl">The Path of Mastery</h2>
            <p className="text-white/45 text-xs">Every lesson struck is dated. Dry becomes geology.</p>
          </div>
          <button onClick={onClose} className="text-white/60 text-sm px-3 py-1 rounded-full bg-white/8">Done</button>
        </div>

        <div className="space-y-5">
          {CURRICULUM.map((track) => (
            <TrackView key={track.id} track={track} done={state.curriculum} />
          ))}
        </div>
        <p className="text-center text-white/30 text-xs py-6">The grind is the transformation.</p>
      </div>
    </div>
  );
}

function TrackView({ track, done }: { track: Track; done: Record<string, boolean> }) {
  const { toggleLesson, state } = useSandhya();
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const tp = trackProgress(track, done);
  const forged = track.courses.filter((c) => courseProgress(c, done).pct === 1).length;
  const artifactSrc = track.id === "cpp" ? "/blade-full.webp" : "/temple-full.webp";

  return (
    <section className="card p-4">
      <header className="mb-3 flex items-start gap-3">
        <img
          src={artifactSrc}
          alt=""
          className="h-16 w-auto shrink-0 transition"
          style={{
            opacity: 0.25 + tp.pct * 0.75,
            filter: `saturate(${0.3 + tp.pct * 0.7}) drop-shadow(0 0 ${tp.pct * 10}px rgba(255,180,90,0.5))`,
          }}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">{track.name}</h3>
            <span className="text-amber-200 text-sm font-medium">{Math.round(tp.pct * 100)}%</span>
          </div>
          <p className="text-white/45 text-[11px]">{track.subtitle}</p>
        </div>
      </header>

      {/* overall bar */}
      <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-2">
        <div className="h-full bg-gradient-to-r from-amber-300 to-orange-400" style={{ width: `${tp.pct * 100}%`, transition: "width .4s ease" }} />
      </div>

      {/* artifact components */}
      <div className="flex items-center gap-1.5 mb-3">
        {track.courses.map((c) => {
          const cp = courseProgress(c, done);
          return (
            <div
              key={c.id}
              title={c.artifact}
              className="flex-1 h-1.5 rounded-full"
              style={{
                background: cp.pct === 1 ? "linear-gradient(90deg,#ffd27a,#ff8c42)" : cp.pct > 0 ? "rgba(255,180,90,0.35)" : "rgba(255,255,255,0.1)",
                boxShadow: cp.pct === 1 ? "0 0 6px rgba(255,150,70,0.6)" : "none",
              }}
            />
          );
        })}
      </div>
      <p className="text-[11px] text-white/40 mb-3">
        {forged} of 4 {track.id === "cpp" ? "blade components forged" : "temple tiers raised"} · {tp.complete}/{tp.total} lessons
      </p>

      {/* courses */}
      <div className="space-y-2">
        {track.courses.map((c) => {
          const cp = courseProgress(c, done);
          const isOpen = openCourse === c.id;
          const complete = cp.pct === 1;
          return (
            <div key={c.id} className={`rounded-xl border ${complete ? "border-amber-200/40 bg-amber-300/10" : "border-white/10 bg-white/5"}`}>
              <button onClick={() => setOpenCourse(isOpen ? null : c.id)} className="w-full text-left px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/90">
                    <span className="text-white/40">{c.n}</span> {c.title}
                  </span>
                  <span className="text-[11px] text-white/50">{cp.complete}/{cp.total} · {c.hours}h</span>
                </div>
                <div className="text-[11px] text-amber-100/70 mt-0.5">{complete ? "✦ " : ""}{c.artifact}</div>
              </button>

              {isOpen && (
                <div className="px-3 pb-3">
                  <p className="text-[11px] text-white/45 italic mb-2 border-l-2 border-amber-300/40 pl-2">
                    Why it matters: {c.why}
                  </p>
                  <div className="space-y-1">
                    {c.lessons.map((l) => {
                      const isDone = !!done[l.id];
                      return (
                        <button
                          key={l.id}
                          onClick={() => {
                            const willComplete = !isDone;
                            toggleLesson(l.id);
                            haptic(8);
                            if (willComplete) {
                              const after = { ...done, [l.id]: true };
                              if (courseProgress(c, after).pct === 1) sounds.bowl(state.soundOn);
                            }
                          }}
                          className={`w-full flex items-center gap-2 text-left rounded-lg px-2.5 py-2 transition ${
                            isDone ? "bg-amber-300/15" : "bg-white/5 active:bg-white/10"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-[5px] shrink-0 flex items-center justify-center text-[10px] border ${
                              isDone ? "bg-amber-300 border-amber-300 text-indigo-950" : "border-white/25"
                            }`}
                          >
                            {isDone ? "✓" : ""}
                          </span>
                          <span className={`text-[12px] leading-tight ${isDone ? "text-amber-50/70 line-through" : "text-white/75"} ${l.project ? "font-medium" : ""}`}>
                            {l.project ? "◆ " : ""}{l.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
