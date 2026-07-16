"use client";

import { useEffect, useState } from "react";
import { useSandhya } from "@/lib/store";
import Dashboard from "@/components/Dashboard";

export default function Page() {
  const { ready, state } = useSandhya();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#141733" }}>
        <div className="w-10 h-10 rounded-full animate-breathe" style={{ background: "radial-gradient(circle,#ffd98a,rgba(255,150,80,0))" }} />
      </div>
    );
  }

  if (!state.startDate) return <Onboarding />;

  return (
    <>
      <Dashboard />
      <SleepVeil />
    </>
  );
}

function Onboarding() {
  const { begin } = useSandhya();
  const [step, setStep] = useState(0);
  const [letter, setLetter] = useState("");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg,#121530 0%,#2a2350 55%,#5a3a52 100%)" }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full text-center">
        {step === 0 && (
          <div className="animate-[breathe_0.6s_ease]">
            <div className="text-6xl mb-4">🌄</div>
            <h1 className="font-serif text-4xl text-white tracking-wide">SANDHYA</h1>
            <p className="text-amber-100/70 mt-2 italic">Seventy-five dawns. One crossing.</p>
            <p className="text-white/70 text-sm leading-relaxed mt-8">
              You are living in a <span className="text-amber-100">sandhya</span> — the threshold between two lives. Your
              notice period is a 75-day twilight between the engineer you were and the architect you&apos;re becoming.
            </p>
            <p className="text-white/60 text-sm leading-relaxed mt-4">
              This isn&apos;t a to-do list with confetti. Every dry C++ lesson, every page, every night you close your
              journal is an offering into the fire. The grind <span className="text-amber-100">is</span> the
              transformation.
            </p>
            <button
              onClick={() => setStep(1)}
              className="mt-10 px-8 py-3 rounded-full bg-amber-400/25 border border-amber-200/50 text-amber-50 ember-glow active:scale-95 transition"
            >
              Begin the crossing →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-[breathe_0.6s_ease] w-full">
            <div className="text-3xl mb-3">💌</div>
            <h2 className="font-serif text-2xl text-white mb-2">A letter across the threshold</h2>
            <p className="text-white/60 text-sm mb-5">
              Say something to the person on the other side — the you standing in full daylight on Day 75. You&apos;ll
              forget you wrote this. Around Day 40, it comes back.
            </p>
            <textarea
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              rows={5}
              placeholder="Dear Day-75 me…"
              className="w-full rounded-2xl bg-white/10 border border-white/20 p-4 text-sm text-white placeholder-white/35 focus:outline-none focus:border-amber-200/50 resize-none font-serif"
            />
            <button
              onClick={() => begin(letter.trim() || "Whatever happens, I showed up. Keep going.")}
              className="mt-6 w-full py-3.5 rounded-full bg-amber-400/30 border border-amber-200/50 text-amber-50 ember-glow active:scale-95 transition font-medium"
            >
              Seal it & raise the first sun 🌅
            </button>
            <button onClick={() => setStep(0)} className="mt-3 text-white/45 text-xs">
              ← back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// The app gets drowsy near 11pm and goes to bed in front of you.
function SleepVeil() {
  const [dismissed, setDismissed] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours();
  const minute = now.getMinutes();
  const past11 = hour === 23 || hour < 4 || (hour === 22 && minute >= 45);
  if (!past11 || dismissed) return null;

  const full = hour === 23 || hour < 4;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center px-8 text-center" style={{ background: "rgba(6,8,22,0.92)", backdropFilter: "blur(3px)" }}>
      <div className="text-4xl mb-4">🌙</div>
      {full ? (
        <>
          <h2 className="font-serif text-3xl text-white/90 tracking-widest">Śubha rātri</h2>
          <p className="text-white/45 text-sm mt-3 max-w-xs">
            Good night. Bed by 11 is one of your four pillars — so the app goes to bed with you.
          </p>
        </>
      ) : (
        <>
          <h2 className="font-serif text-2xl text-white/85">The day is winding down.</h2>
          <p className="text-white/45 text-sm mt-3 max-w-xs">It&apos;s nearly 11. Pour the day, close the journal, and rest.</p>
        </>
      )}
      <button onClick={() => setDismissed(true)} className="mt-8 px-6 py-2.5 rounded-full bg-white/10 text-white/70 text-sm active:scale-95">
        I&apos;m finishing my journal
      </button>
    </div>
  );
}
