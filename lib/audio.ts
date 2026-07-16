// Gentle, synthesized sound — no external assets, no fanfares, no coin sounds. Ever.
// One sense per moment. Everything optional.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(
  freq: number,
  durationMs: number,
  type: OscillatorType = "sine",
  gain = 0.12,
  glideTo?: number
) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, c.currentTime + durationMs / 1000);
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + durationMs / 1000);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + durationMs / 1000 + 0.05);
}

export const sounds = {
  // Tibetan-bowl swell when a Sun Arc segment closes.
  bowl(enabled: boolean) {
    if (!enabled) return;
    tone(196, 1600, "sine", 0.14);
    setTimeout(() => tone(293.66, 1400, "sine", 0.08), 60);
    setTimeout(() => tone(392, 1200, "sine", 0.05), 120);
  },
  // Soft anvil tink every 5 minutes in Forge Mode.
  tink(enabled: boolean) {
    if (!enabled) return;
    tone(1320, 90, "triangle", 0.08, 880);
  },
  // Single firm hammer strike at the end of a heat.
  hammer(enabled: boolean) {
    if (!enabled) return;
    tone(140, 260, "sawtooth", 0.16, 70);
    setTimeout(() => tone(90, 200, "sine", 0.1), 20);
  },
  // A dawn-chorus bird note (Surya) / low tanpura drone (Soma).
  bird(enabled: boolean) {
    if (!enabled) return;
    tone(1760, 180, "sine", 0.06, 2200);
    setTimeout(() => tone(2093, 160, "sine", 0.05, 1760), 140);
  },
  tanpura(enabled: boolean) {
    if (!enabled) return;
    tone(146.83, 2200, "sawtooth", 0.05);
    setTimeout(() => tone(220, 2000, "sine", 0.04), 100);
  },
  // Water meeting light during the arghya pour.
  pour(enabled: boolean) {
    if (!enabled) return;
    tone(660, 900, "sine", 0.07, 1320);
    setTimeout(() => tone(880, 700, "sine", 0.05, 1760), 120);
  },
  // Grit spark — a tiny white-hot mote.
  spark(enabled: boolean) {
    if (!enabled) return;
    tone(2400, 70, "triangle", 0.05, 3200);
  },
};

export function haptic(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
}
