"use client";

import { useRef, useState } from "react";
import { useSandhya } from "@/lib/store";

// Local-only storage → backup matters. Export/import as a safety net.
export default function Settings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, exportData, importData, reset, setLastWorkingDay } = useSandhya();
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const download = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sandhya-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Backup downloaded. Keep it somewhere safe.");
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setMsg(importData(text) ? "Restored from backup. Welcome back." : "That file didn't look right.");
  };

  return (
    <div className="fixed inset-0 z-[55] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-sm h-full overflow-y-auto safe-top safe-bottom px-5 py-6"
        style={{ background: "linear-gradient(180deg,#17153a,#241a30)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-serif text-xl">Settings & Backup</h2>
          <button onClick={onClose} className="text-white/60 text-sm px-3 py-1 rounded-full bg-white/8">
            Done
          </button>
        </div>

        <div className="space-y-5">
          <div className="card p-4">
            <div className="text-white/85 text-sm font-medium mb-1">Your data lives in this browser</div>
            <p className="text-white/50 text-xs mb-3">
              Nothing is uploaded anywhere. Export a backup regularly — clearing your browser or switching phones will
              otherwise lose the crossing.
            </p>
            <div className="flex gap-2">
              <button onClick={download} className="flex-1 rounded-xl py-2.5 text-sm bg-amber-400/20 border border-amber-300/40 text-amber-50 active:scale-95">
                ⬇ Export backup
              </button>
              <button onClick={() => fileRef.current?.click()} className="flex-1 rounded-xl py-2.5 text-sm bg-white/8 border border-white/15 text-white/80 active:scale-95">
                ⬆ Import
              </button>
              <input ref={fileRef} type="file" accept="application/json" hidden onChange={onFile} />
            </div>
            {msg && <p className="text-emerald-200/80 text-xs mt-2">{msg}</p>}
          </div>

          <div className="card p-4">
            <label className="text-white/85 text-sm font-medium block mb-1">Your last working day at KPIT</label>
            <p className="text-white/50 text-xs mb-2">That morning gets a quiet full-screen goodbye.</p>
            <input
              type="date"
              defaultValue={state.lastWorkingDay ?? ""}
              onChange={(e) => setLastWorkingDay(e.target.value || null)}
              className="w-full rounded-xl bg-white/8 border border-white/15 p-2.5 text-sm text-white [color-scheme:dark]"
            />
          </div>

          <div className="card p-4">
            <div className="text-white/85 text-sm font-medium mb-1">The threshold letter</div>
            <p className="text-white/50 text-xs whitespace-pre-line">
              {state.thresholdLetter
                ? `Sealed. It returns to you around Day 40.\n\n“${state.thresholdLetter.slice(0, 90)}${state.thresholdLetter.length > 90 ? "…" : ""}”`
                : "Not written."}
            </p>
          </div>

          <div className="card p-4 border border-red-300/20">
            <div className="text-white/85 text-sm font-medium mb-1">Start over</div>
            <p className="text-white/50 text-xs mb-3">Wipes everything and begins a new crossing. Export a backup first.</p>
            <button
              onClick={() => {
                if (confirm("Reset the entire journey? This cannot be undone.")) {
                  reset();
                  onClose();
                }
              }}
              className="rounded-xl px-4 py-2 text-sm bg-red-400/15 border border-red-300/30 text-red-100 active:scale-95"
            >
              Reset journey
            </button>
          </div>

          <p className="text-center text-white/30 text-xs pt-4">SANDHYA · the threshold is the temple</p>
        </div>
      </div>
    </div>
  );
}
