// The Long Dawn — one sunrise stretched across 75 days.
// Progress (0..1) walks the sky from deep pre-dawn indigo to full gold morning.
// It is NEVER fully black at 0 (goal-gradient: dawn has already begun because you decided to start).

export const TOTAL_DAYS = 75;

type RGB = [number, number, number];

// Stops for the ZENITH (top of sky) across the journey.
const ZENITH_STOPS: { p: number; c: RGB }[] = [
  { p: 0.0, c: [18, 21, 48] }, // deep indigo pre-dawn (already lit, not black)
  { p: 0.33, c: [46, 40, 92] }, // violet — First Twilight (Day 25)
  { p: 0.66, c: [120, 96, 150] }, // rose-violet — High Crossing (Day 50)
  { p: 1.0, c: [126, 176, 222] }, // soft morning blue — Emergence (Day 75)
];

// Stops for the HORIZON (bottom of sky) across the journey.
const HORIZON_STOPS: { p: number; c: RGB }[] = [
  { p: 0.0, c: [58, 44, 74] }, // faint warm band at the horizon
  { p: 0.33, c: [150, 78, 92] }, // rose
  { p: 0.66, c: [235, 148, 92] }, // amber
  { p: 1.0, c: [255, 214, 130] }, // gold
];

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function sample(stops: { p: number; c: RGB }[], p: number): RGB {
  const clamped = Math.max(0, Math.min(1, p));
  for (let i = 0; i < stops.length - 1; i++) {
    const lo = stops[i];
    const hi = stops[i + 1];
    if (clamped >= lo.p && clamped <= hi.p) {
      const t = (clamped - lo.p) / (hi.p - lo.p || 1);
      return [
        lerp(lo.c[0], hi.c[0], t),
        lerp(lo.c[1], hi.c[1], t),
        lerp(lo.c[2], hi.c[2], t),
      ];
    }
  }
  return stops[stops.length - 1].c;
}

const rgb = (c: RGB) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

export interface SkyPalette {
  zenith: string;
  mid: string;
  horizon: string;
  gradient: string;
  sunGlow: string;
  ink: string; // readable text color over this sky
  inkSoft: string;
}

export function skyForProgress(progress: number): SkyPalette {
  const z = sample(ZENITH_STOPS, progress);
  const h = sample(HORIZON_STOPS, progress);
  const mid: RGB = [
    Math.round((z[0] + h[0]) / 2),
    Math.round((z[1] + h[1]) / 2),
    Math.round((z[2] + h[2]) / 2),
  ];

  // Sun glow warms and brightens as the journey climbs.
  const glow = sample(HORIZON_STOPS, Math.min(1, progress + 0.15));

  // Ink stays warm off-white until the sky is bright enough to need dark ink.
  const bright = progress > 0.72;

  return {
    zenith: rgb(z),
    mid: rgb(mid),
    horizon: rgb(h),
    gradient: `linear-gradient(180deg, ${rgb(z)} 0%, ${rgb(mid)} 55%, ${rgb(h)} 100%)`,
    sunGlow: rgb(glow),
    ink: bright ? "rgba(30,22,16,0.92)" : "rgba(255,248,238,0.94)",
    inkSoft: bright ? "rgba(40,30,20,0.62)" : "rgba(255,248,238,0.6)",
  };
}

// How high the sun sits in the sky today: base on overall progress, plus today's
// three closed segments raise it one degree at a time (Apple-ring completion drive).
export function sunHeight(progress: number, segmentsClosedToday: number): number {
  const base = 0.12 + progress * 0.64; // never at the floor
  const todayLift = (segmentsClosedToday / 3) * 0.18;
  return Math.min(0.98, base + todayLift);
}

export function labelForProgress(dayIndex: number): string {
  if (dayIndex >= TOTAL_DAYS) return "Sāyaṁ Sandhyā — the Emergence";
  if (dayIndex >= 50) return "Mādhyāhnika — the High Crossing";
  if (dayIndex >= 25) return "Prātaḥ Sandhyā — First Twilight";
  return "The Long Dawn has begun";
}
