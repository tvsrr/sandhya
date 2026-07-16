import type { RewardResult, SandhyaState, DayRecord } from "./types";

// Arghya — the nightly offering. Something comes back, of variable magnitude.
// Nothing here is currency. There is no shop. Every reward is MEANING:
// your own words, real stats, real beauty. Grit Sparks (endured boredom) are the
// ONLY thing that improves the odds of a rarer, warmer return.

const VERSES: string[] = [
  "“Yoga is skill in action.” — Bhagavad Gita 2.50",
  "“You have a right to your actions, but never to the fruits of your actions.” — Gita 2.47",
  "“The mind is restless, but it can be trained.” — Gita 6.35",
  "“There is no way to do great work without doing a lot of tedious work first.” — Richard Hamming",
  "“The most important property of a program is whether it accomplishes the intention of its user.” — C.A.R. Hoare",
  "“Design and programming are human activities; forget that and all is lost.” — Bjarne Stroustrup",
  "“Simplicity is prerequisite for reliability.” — Edsger Dijkstra",
  "“Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.” — A.P.J. Abdul Kalam",
  "“Excellence is a continuous process and not an accident.” — A.P.J. Abdul Kalam",
  "“Arise, awake, and stop not till the goal is reached.” — Katha Upanishad / Swami Vivekananda",
  "“The one who acts without attachment attains the Supreme.” — Gita 3.19",
  "“Let your reach exceed your grasp, or what's a heaven for?” — Robert Browning",
];

const RELIC_NAMES: string[] = [
  "The Open Door in a Field",
  "The First Star Over the Anvil",
  "The Ferryman's Lantern",
  "The Threshold Stone",
  "The Blade Half-Drawn",
  "The Waxing Moon Over Water",
  "The Cupped Hands of Dawn",
  "The Long Shadow Walking East",
  "The Ember That Would Not Die",
  "The Sun Caught in the Doorframe",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Build a small pool of stat-gems from real state.
function statGems(state: SandhyaState, today: DayRecord): string[] {
  const gems: string[] = [];
  const allDays = Object.values(state.days);
  const litCount = allDays.filter((d) => segmentsClosed(d) === 3 || d.lampBurned).length;
  const totalHeats = allDays.reduce((s, d) => s + d.forgeHeats, 0);
  const totalSparks = allDays.reduce((s, d) => s + d.gritSparks, 0);
  const totalPages = allDays.reduce((s, d) => s + d.pagesRead, 0);

  if (litCount > 0) gems.push(`${litCount} ${litCount === 1 ? "dawn" : "dawns"} lit so far. The light does not rewind.`);
  if (totalHeats > 0) gems.push(`${totalHeats} forge heats endured. The blade is taking shape.`);
  if (totalSparks > 0) gems.push(`${totalSparks} Grit Sparks minted from boredom you refused to flee.`);
  if (totalPages >= 20) gems.push(`${totalPages} pages read. That's a small library building inside you.`);
  if (state.craftRating > 1000) gems.push(`Craft Rating ${state.craftRating}. A real number, honestly earned.`);
  if (today.gritSparks >= 2) gems.push(`You sat in the dry material today and did not run. That is the whole game.`);
  return gems.length ? gems : ["The day is offered. Tomorrow the sun rises one degree higher."];
}

export function segmentsClosed(d: DayRecord): number {
  let n = 0;
  if (d.gym && d.sandhya) n++; // DEHA
  if (d.forgeHeats >= 1 && d.architect && d.leetSolved >= 2) n++; // KARMA
  if (d.pagesRead >= 20 && d.journal.trim().length > 0 && d.stress) n++; // CHITTA
  return n;
}

// Draw a reward. sparksToday raises the odds of rarer returns.
export function drawReward(state: SandhyaState, today: DayRecord): RewardResult {
  const sparks = Math.min(3, today.gritSparks);
  const r = Math.random();

  // Base odds, nudged upward by endured boredom.
  const threadChance = 0.02 + sparks * 0.015; // very rare
  const relicChance = 0.1 + sparks * 0.05; // rare, and you don't already own all
  const lampChance = 0.16 + sparks * 0.03; // some nights, valuable

  const uncollected = Array.from({ length: 75 }, (_, i) => i + 1).filter(
    (id) => !state.relics.includes(id)
  );

  if (r < threadChance) {
    const litDays = Object.values(state.days).filter((d) => segmentsClosed(d) === 3);
    const gilded = litDays.length ? pick(litDays) : today;
    return {
      kind: "thread",
      title: "A Golden Thread",
      body: `${gilded.date} deserved gold. The app gilds it on your calendar — a day you showed up when it was hard.`,
    };
  }

  if (r < threadChance + relicChance && uncollected.length > 0 && state.lamps < 3) {
    const id = pick(uncollected);
    return {
      kind: "relic",
      title: `Relic — ${pick(RELIC_NAMES)}`,
      body: `Card ${id} of 75 joins *The Crossing*. On Day 75 they assemble into one image.`,
      relicId: id,
    };
  }

  if (r < threadChance + relicChance + lampChance && state.lamps < 3) {
    return {
      kind: "lamp",
      title: "A Ghee Lamp 🪔",
      body: "Banked. If a day slips, this lamp burns through the night in your place. Kept, not skipped.",
    };
  }

  // Most nights: a small warm thing.
  const warmPool: string[] = [];
  // Prefer returning the human's OWN past words.
  const pastJournals = Object.values(state.days)
    .filter((d) => d.date !== today.date && d.journal.trim().length > 20)
    .map((d) => d.journal.trim());
  if (pastJournals.length && Math.random() < 0.5) {
    const line = pick(pastJournals);
    const snippet = line.length > 180 ? line.slice(0, 177) + "…" : line;
    return {
      kind: "warm",
      title: "Your own words return",
      body: `You once wrote:\n\n“${snippet}”`,
    };
  }
  warmPool.push(...statGems(state, today));
  warmPool.push(pick(VERSES));
  return { kind: "warm", title: "The dusk answers", body: pick(warmPool) };
}

export function relicName(id: number): string {
  return RELIC_NAMES[id % RELIC_NAMES.length];
}
