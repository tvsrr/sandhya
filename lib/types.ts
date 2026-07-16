export type WakePath = "surya" | "soma";
export type StressMood = "good" | "ok" | "heavy";

export interface DayRecord {
  date: string; // YYYY-MM-DD (local)
  // DEHA — body / morning ritual
  wakePath: WakePath | null;
  gym: boolean;
  sandhya: boolean;
  // KARMA — craft
  forgeHeats: number; // completed 25-min heats
  gritSparks: number;
  architect: boolean;
  leetSolved: number;
  kpit: boolean;
  // CHITTA — mind
  pagesRead: number;
  journal: string;
  stress: StressMood | null;
  // focus / pomodoro — minutes logged per domain today
  focusLog: Record<string, number>;
  // meta
  poured: boolean;
  lampBurned: boolean;
}

export type FocusTag = "cpp" | "arch" | "leet" | "read" | "kpit";

export interface PomodoroSettings {
  work: number; // minutes
  short: number;
  long: number;
  rounds: number; // work rounds before a long break
}

export type RewardKind = "warm" | "lamp" | "relic" | "thread";

export interface RewardResult {
  kind: RewardKind;
  title: string;
  body: string;
  relicId?: number;
}

export interface SandhyaState {
  startDate: string | null; // Day 1, YYYY-MM-DD
  lastWorkingDay: string | null;
  days: Record<string, DayRecord>;
  weekPillars: Record<string, "held" | "slipped">; // key: YYYY-MM-DD -> health-pillar day mark
  lamps: number; // banked ghee lamps (max 3)
  relics: number[]; // collected relic ids (1..75)
  craftRating: number; // LeetCode "Craft Rating"
  thresholdLetter: string; // written Day 1, returned ~Day 40
  thresholdLetterReturned: boolean;
  soundOn: boolean;
  compilerCards: string[]; // collected "Compiler Speaks" lines
  seenMilestones: number[]; // day indexes celebrated
  curriculum: Record<string, boolean>; // lesson id -> completed
  pomodoro: PomodoroSettings;
  version: number;
}
