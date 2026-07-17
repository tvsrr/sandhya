"use client";

import { motion } from "framer-motion";

// The Ember Bowl as a physical vessel resting on the horizon. It visibly fills as
// arcs close. A button asked to be clicked; a full bowl asks to be poured.
export default function Bowl({
  fill, // 0..1
  full,
  poured,
  onClick,
}: {
  fill: number;
  full: boolean;
  poured: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center"
        style={{ width: 128, height: 128 }}
        aria-label="the offering bowl"
      >
        {/* glow that grows with fill / shimmers when full */}
        <div
          className={`absolute inset-0 rounded-full ${full && !poured ? "animate-breathe" : ""}`}
          style={{
            background: `radial-gradient(circle at 50% 45%, rgba(255,200,110,${poured ? 0.06 : 0.12 + fill * 0.4}), rgba(255,150,80,0) 68%)`,
            transform: "scale(1.5)",
          }}
        />
        <img
          src="/bowl.webp"
          alt=""
          className="relative w-full h-full object-contain"
          style={{
            filter: poured
              ? "grayscale(0.35) brightness(0.8)"
              : `drop-shadow(0 6px ${10 + fill * 24}px rgba(255,180,90,${0.25 + fill * 0.4}))`,
            opacity: poured ? 0.7 : 1,
          }}
        />
        {/* accumulating embers as fill rises */}
        {!poured &&
          Array.from({ length: Math.round(fill * 4) }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-amber-200 animate-breathe"
              style={{
                width: 4,
                height: 4,
                left: `${42 + i * 6}%`,
                top: `${46 + (i % 2) * 5}%`,
                boxShadow: "0 0 8px 2px rgba(255,200,120,0.9)",
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
      </motion.button>

      <p className={`mt-1 text-xs ${poured ? "text-white/45" : full ? "text-amber-100" : "text-white/55"}`}>
        {poured ? "The day is offered · rest now" : full ? "The day is full. Offer it." : "The bowl fills as the day closes."}
      </p>
    </div>
  );
}
