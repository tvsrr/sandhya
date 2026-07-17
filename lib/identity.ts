import type { SandhyaState } from "./types";

// Atomic Habits, made literal: "Every action is a vote for the person you wish to
// become." Each future self is fed by real, already-tracked actions — no new
// mechanic, no new storage. Effort visibly gears up a specific Ram.

export interface Identity {
  id: string;
  name: string; // e.g. "Fitter Ram"
  tagline: string;
  feeds: string; // plain-language: what casts a vote
  why: string;
  votes: number;
  stage: string;
  progress: number; // 0..1 toward "forged"
}

const FORGED_AT = 150; // ~two votes a day across the 75-day crossing

function stageFor(votes: number): string {
  if (votes <= 0) return "dormant";
  if (votes < 10) return "stirring";
  if (votes < 30) return "gearing up";
  if (votes < 70) return "taking shape";
  if (votes < FORGED_AT) return "strong";
  return "forged";
}

function lessonsDone(state: SandhyaState, prefix: string): number {
  return Object.keys(state.curriculum).filter((k) => k.startsWith(prefix) && state.curriculum[k]).length;
}

export function computeIdentities(state: SandhyaState, name = "Ram"): Identity[] {
  const days = Object.values(state.days);
  const heldPillars = Object.values(state.weekPillars).filter((v) => v === "held").length;

  const fitter =
    days.filter((d) => d.gym).length + heldPillars;

  const architect =
    days.filter((d) => d.architect).length + lessonsDone(state, "arch-");

  const engineer =
    days.reduce((s, d) => s + d.forgeHeats, 0) +
    days.reduce((s, d) => s + d.leetSolved, 0) +
    lessonsDone(state, "cpp-");

  const centered =
    days.filter((d) => d.sandhya).length +
    days.filter((d) => d.journal.trim().length > 0).length +
    days.filter((d) => d.pagesRead >= 20).length +
    days.filter((d) => d.stress === "good" || d.stress === "ok").length;

  const raw: Omit<Identity, "stage" | "progress">[] = [
    {
      id: "fitter",
      name: `Fitter ${name}`,
      tagline: "the body that carries you across",
      feeds: "gym days & clean-living days",
      why: "Every workout and held health-day is a vote for the person who reaches the far shore stronger than they left it.",
      votes: fitter,
    },
    {
      id: "architect",
      name: `Architect ${name}`,
      tagline: "the systems-thinker taking shape",
      feeds: "architect sessions & architect lessons",
      why: "Each design lesson and architect session is the architect muscle gearing up — the whole reason for this crossing.",
      votes: architect,
    },
    {
      id: "engineer",
      name: `Engineer ${name}`,
      tagline: "the craftsman at the forge",
      feeds: "forge heats, spars & C++ lessons",
      why: "Every dry C++ heat and sparring problem forges honest skill — competence you can feel, not badges you collect.",
      votes: engineer,
    },
    {
      id: "centered",
      name: `Centered ${name}`,
      tagline: "the calm, well-read mind",
      feeds: "ritual, pages, journal & calm days",
      why: "Sandhyavandanam, pages read, and honest nights are votes for the calmer, wiser person you said you wanted to become.",
      votes: centered,
    },
  ];

  return raw.map((r) => ({
    ...r,
    stage: stageFor(r.votes),
    progress: Math.min(1, r.votes / FORGED_AT),
  }));
}

export function totalVotes(state: SandhyaState): number {
  return computeIdentities(state).reduce((s, i) => s + i.votes, 0);
}
