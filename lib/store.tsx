"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { DayRecord, FocusTag, PomodoroSettings, RewardResult, SandhyaState, StressMood, WakePath } from "./types";
import { TOTAL_DAYS } from "./sky";
import { drawReward, segmentsClosed } from "./rewards";

const STORAGE_KEY = "sandhya.v1";

// ---------- date helpers ----------
export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = fromKey.split("-").map(Number);
  const [ty, tm, td] = toKey.split("-").map(Number);
  const a = Date.UTC(fy, fm - 1, fd);
  const b = Date.UTC(ty, tm - 1, td);
  return Math.round((b - a) / 86400000);
}

function emptyDay(date: string): DayRecord {
  return {
    date,
    wakePath: null,
    gym: false,
    sandhya: false,
    forgeHeats: 0,
    gritSparks: 0,
    architect: false,
    leetSolved: 0,
    kpit: false,
    pagesRead: 0,
    journal: "",
    stress: null,
    focusLog: {},
    poured: false,
    lampBurned: false,
  };
}

function initialState(): SandhyaState {
  return {
    startDate: null,
    lastWorkingDay: null,
    days: {},
    weekPillars: {},
    lamps: 0,
    relics: [],
    craftRating: 1000,
    thresholdLetter: "",
    thresholdLetterReturned: false,
    soundOn: true,
    compilerCards: [],
    seenMilestones: [],
    curriculum: {},
    pomodoro: { work: 25, short: 5, long: 15, rounds: 4 },
    version: 1,
  };
}

// ---------- context ----------
interface SandhyaCtx {
  ready: boolean;
  state: SandhyaState;
  today: DayRecord;
  todayK: string;
  dayIndex: number; // 1..75+
  daysLit: number;
  progress: number; // 0..1
  segmentsToday: number;
  begin: (letter: string, startKey?: string) => void;
  patchToday: (patch: Partial<DayRecord>) => void;
  addGritSpark: () => number; // returns new count (capped 3/session handled in UI)
  completeHeat: () => void;
  logFocus: (tag: FocusTag, minutes: number) => void;
  toggleLesson: (id: string) => void;
  setPomodoro: (patch: Partial<PomodoroSettings>) => void;
  logLeet: (difficulty: "easy" | "medium" | "hard", usedHints: boolean) => void;
  setWakePath: (p: WakePath) => void;
  setStress: (m: StressMood) => void;
  markPillar: (mark: "held" | "slipped") => void;
  pour: () => RewardResult | null;
  setLastWorkingDay: (key: string | null) => void;
  toggleSound: () => void;
  markLetterReturned: () => void;
  celebrate: (day: number) => void;
  reset: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
}

const Ctx = createContext<SandhyaCtx | null>(null);

export function SandhyaProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SandhyaState>(initialState);
  const [ready, setReady] = useState(false);

  // load once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SandhyaState;
        setState({ ...initialState(), ...parsed });
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  // persist — only after load has run, so the empty initial state is never
  // written over saved data (gating on `ready` state, not a synchronous ref).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / private mode */
    }
  }, [state, ready]);

  const todayK = todayKey();
  const today = state.days[todayK] ?? emptyDay(todayK);

  const dayIndex = state.startDate ? daysBetween(state.startDate, todayK) + 1 : 0;

  const daysLit = useMemo(
    () => Object.values(state.days).filter((d) => segmentsClosed(d) === 3 || d.lampBurned).length,
    [state.days]
  );

  const progress = Math.min(1, daysLit / TOTAL_DAYS);
  const segmentsToday = segmentsClosed(today);

  // ---------- mutators ----------
  const update = (fn: (s: SandhyaState) => SandhyaState) => setState((s) => fn(s));

  const patchTodayRaw = (s: SandhyaState, patch: Partial<DayRecord>): SandhyaState => {
    const cur = s.days[todayK] ?? emptyDay(todayK);
    return { ...s, days: { ...s.days, [todayK]: { ...cur, ...patch } } };
  };

  const api: SandhyaCtx = {
    ready,
    state,
    today,
    todayK,
    dayIndex,
    daysLit,
    progress,
    segmentsToday,

    begin: (letter, startKey) =>
      update((s) => ({
        ...s,
        startDate: startKey ?? todayKey(),
        thresholdLetter: letter,
      })),

    patchToday: (patch) => update((s) => patchTodayRaw(s, patch)),

    addGritSpark: () => {
      let next = 0;
      update((s) => {
        const cur = s.days[todayK] ?? emptyDay(todayK);
        next = cur.gritSparks + 1;
        return patchTodayRaw(s, { gritSparks: next });
      });
      return next;
    },

    completeHeat: () =>
      update((s) => {
        const cur = s.days[todayK] ?? emptyDay(todayK);
        return patchTodayRaw(s, { forgeHeats: cur.forgeHeats + 1 });
      }),

    logFocus: (tag, minutes) =>
      update((s) => {
        const cur = s.days[todayK] ?? emptyDay(todayK);
        const log = { ...(cur.focusLog ?? {}) };
        log[tag] = (log[tag] ?? 0) + minutes;
        return patchTodayRaw(s, { focusLog: log });
      }),

    toggleLesson: (id) =>
      update((s) => ({ ...s, curriculum: { ...s.curriculum, [id]: !s.curriculum[id] } })),

    setPomodoro: (patch) =>
      update((s) => ({ ...s, pomodoro: { ...s.pomodoro, ...patch } })),

    logLeet: (difficulty, usedHints) =>
      update((s) => {
        const cur = s.days[todayK] ?? emptyDay(todayK);
        const base = difficulty === "hard" ? 26 : difficulty === "medium" ? 16 : 8;
        const delta = usedHints ? Math.round(base * 0.45) : base;
        const nextRating = Math.max(600, s.craftRating + delta);
        const s2 = patchTodayRaw(s, { leetSolved: cur.leetSolved + 1 });
        return { ...s2, craftRating: nextRating };
      }),

    setWakePath: (p) => update((s) => patchTodayRaw(s, { wakePath: p })),
    setStress: (m) => update((s) => patchTodayRaw(s, { stress: m })),

    markPillar: (mark) => update((s) => ({ ...s, weekPillars: { ...s.weekPillars, [todayK]: mark } })),

    pour: () => {
      if (!state.startDate) return null;
      const cur = state.days[todayK] ?? emptyDay(todayK);
      if (cur.poured) return null;
      const reward = drawReward(state, cur);
      update((s) => {
        let s2 = patchTodayRaw(s, { poured: true });
        if (reward.kind === "lamp") s2 = { ...s2, lamps: Math.min(3, s2.lamps + 1) };
        if (reward.kind === "relic" && reward.relicId)
          s2 = s2.relics.includes(reward.relicId)
            ? s2
            : { ...s2, relics: [...s2.relics, reward.relicId] };
        return s2;
      });
      return reward;
    },

    setLastWorkingDay: (key) => update((s) => ({ ...s, lastWorkingDay: key })),
    toggleSound: () => update((s) => ({ ...s, soundOn: !s.soundOn })),
    markLetterReturned: () => update((s) => ({ ...s, thresholdLetterReturned: true })),
    celebrate: (day) =>
      update((s) =>
        s.seenMilestones.includes(day) ? s : { ...s, seenMilestones: [...s.seenMilestones, day] }
      ),

    reset: () => setState(initialState()),

    exportData: () => JSON.stringify(state, null, 2),
    importData: (json) => {
      try {
        const parsed = JSON.parse(json) as SandhyaState;
        if (typeof parsed !== "object" || parsed === null) return false;
        setState({ ...initialState(), ...parsed });
        return true;
      } catch {
        return false;
      }
    },
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useSandhya(): SandhyaCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSandhya must be used within SandhyaProvider");
  return c;
}
