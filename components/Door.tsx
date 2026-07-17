"use client";

import { motion } from "framer-motion";
import { haptic } from "@/lib/audio";

export type DoorState = "unlit" | "stirring" | "lit";

// A tall carved tablet. The Gestalt itch of one dark door between two lit ones is
// the whole engagement engine of the home screen — and it costs zero words.
export default function Door({
  glyph,
  name,
  state,
  status,
  onClick,
}: {
  glyph: string;
  name: string;
  state: DoorState;
  status: string;
  onClick: () => void;
}) {
  const lit = state === "lit";
  const stirring = state === "stirring";

  return (
    <motion.button
      onClick={() => {
        haptic(8);
        onClick();
      }}
      whileTap={{ scale: 0.96 }}
      className="relative flex-1 flex flex-col items-center justify-between rounded-2xl px-2 py-4 overflow-hidden"
      style={{
        minHeight: 156,
        border: lit
          ? "1px solid rgba(255,196,120,0.55)"
          : stirring
          ? "1px solid rgba(255,196,120,0.28)"
          : "1px solid rgba(255,255,255,0.1)",
        background: lit
          ? "linear-gradient(180deg, rgba(255,170,90,0.22) 0%, rgba(120,70,40,0.18) 100%)"
          : stirring
          ? "linear-gradient(180deg, rgba(255,170,90,0.1) 0%, rgba(30,32,60,0.4) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.15) 100%)",
        boxShadow: lit
          ? "0 0 22px rgba(255,150,70,0.35), inset 0 1px 0 rgba(255,220,160,0.35)"
          : "inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* ember bloom behind the glyph when lit */}
      {lit && (
        <div
          className="absolute inset-x-0 top-6 mx-auto h-16 w-16 rounded-full animate-breathe"
          style={{ background: "radial-gradient(circle, rgba(255,190,110,0.5), rgba(255,150,80,0) 70%)" }}
        />
      )}

      <span
        className="relative text-3xl mt-1"
        style={{ filter: lit ? "drop-shadow(0 0 8px rgba(255,180,90,0.8))" : stirring ? "none" : "grayscale(0.6) opacity(0.75)" }}
      >
        {glyph}
      </span>

      <div className="relative text-center">
        <div className={`text-[13px] font-medium tracking-wide ${lit ? "text-amber-50" : "text-white/80"}`}>{name}</div>
        <div className={`text-[10px] mt-0.5 ${lit ? "text-amber-200/80" : stirring ? "text-amber-200/60" : "text-white/40"}`}>
          {status}
        </div>
      </div>
    </motion.button>
  );
}
