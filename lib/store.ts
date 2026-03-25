"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TaskStatus } from "./data";
import { supabase } from "./supabase";

export interface TaskState {
  status: TaskStatus;
  completedAt?: string; // ISO date string
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  tasksCompleted: number;
}

export interface AppState {
  tasks: Record<string, TaskState>; // taskId -> state
  weekNotes: Record<string, string>; // weekId -> note
  dayLogs: DayLog[];
  lastActive: string; // YYYY-MM-DD
}

const STORAGE_KEY = "emai-prep-v1";

const defaultState = (): AppState => ({
  tasks: {},
  weekNotes: {},
  dayLogs: [],
  lastActive: "",
});

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return JSON.parse(raw) as AppState;
  } catch {
    return defaultState();
  }
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const isHydrating = useRef(false);

  useEffect(() => {
    if (isHydrating.current) return;
    isHydrating.current = true;

    async function init() {
      // 1. Load local state as fallback/initial render
      const local = loadState();
      let loaded = local;

      // 2. Fetch remote state from Supabase
      try {
        const { data, error } = await supabase
          .from("progress")
          .select("state")
          .eq("id", "default")
          .single();

        if (data?.state) {
          loaded = data.state as AppState;
          saveState(loaded); // Update local cache with remote state
        } else if (error && error.code !== "PGRST116") {
          // Ignore "PGRST116" which is "Row not found"
          console.warn("Failed to load from Supabase:", error);
        }
      } catch (err) {
        console.warn("Error fetching Supabase state:", err);
      }

      // Log today as active if not already
      const today = todayStr();
      const alreadyLogged = loaded.dayLogs.some((d) => d.date === today);
      if (!alreadyLogged) {
        loaded.dayLogs.push({ date: today, tasksCompleted: 0 });
      }
      loaded.lastActive = today;
      setState(loaded);
      setHydrated(true);
    }

    init();
  }, []);

  const persist = useCallback((next: AppState) => {
    setState(next);
    saveState(next);

    // Async Supabase sync
    supabase
      .from("progress")
      .upsert({ id: "default", state: next })
      .then(({ error }) => {
        if (error) console.error("Failed to save to Supabase", error);
      });
  }, []);

  // ── Task actions ─────────────────────────────────────────────

  const setTaskStatus = useCallback(
    (taskId: string, status: TaskStatus) => {
      const next = { ...state };
      const prev = next.tasks[taskId];
      next.tasks = {
        ...next.tasks,
        [taskId]: {
          status,
          completedAt:
            status === "done"
              ? new Date().toISOString()
              : prev?.completedAt,
        },
      };

      // Increment today's task count if marking done
      const today = todayStr();
      if (status === "done" && prev?.status !== "done") {
        next.dayLogs = next.dayLogs.map((d) =>
          d.date === today
            ? { ...d, tasksCompleted: d.tasksCompleted + 1 }
            : d
        );
        if (!next.dayLogs.some((d) => d.date === today)) {
          next.dayLogs.push({ date: today, tasksCompleted: 1 });
        }
      }

      persist(next);
    },
    [state, persist]
  );

  const setWeekNote = useCallback(
    (weekId: string, note: string) => {
      persist({ ...state, weekNotes: { ...state.weekNotes, [weekId]: note } });
    },
    [state, persist]
  );

  const resetAll = useCallback(() => {
    persist(defaultState());
  }, [persist]);

  // ── Derived ──────────────────────────────────────────────────

  const getTaskStatus = (taskId: string): TaskStatus =>
    state.tasks[taskId]?.status ?? "todo";

  const getWeekProgress = (weekId: string, taskIds: string[]) => {
    const done = taskIds.filter((id) => getTaskStatus(id) === "done").length;
    const inprog = taskIds.filter(
      (id) => getTaskStatus(id) === "inprogress"
    ).length;
    return { done, inprog, total: taskIds.length };
  };

  const getPhaseProgress = (weekIds: string[], allWeeks: { id: string; tasks: { id: string }[] }[]) => {
    const weeks = allWeeks.filter((w) => weekIds.includes(w.id));
    const totalTasks = weeks.flatMap((w) => w.tasks).length;
    const doneTasks = weeks
      .flatMap((w) => w.tasks)
      .filter((t) => getTaskStatus(t.id) === "done").length;
    return { done: doneTasks, total: totalTasks };
  };

  // ── Streak calculation ────────────────────────────────────────

  const streak = (() => {
    const logs = [...state.dayLogs]
      .filter((d) => d.tasksCompleted > 0)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (logs.length === 0) return 0;

    const today = todayStr();
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    // Streak must include today or yesterday
    if (logs[0].date !== today && logs[0].date !== yesterday) return 0;

    let count = 0;
    let expected = logs[0].date;
    for (const log of logs) {
      if (log.date === expected) {
        count++;
        const d = new Date(expected);
        d.setDate(d.getDate() - 1);
        expected = d.toISOString().slice(0, 10);
      } else {
        break;
      }
    }
    return count;
  })();

  // ── Knowledge node completion ─────────────────────────────────
  // A node is "complete" if all tasks in its contributing weeks are done

  const getNodeCompletion = (
    weekIds: string[],
    allWeeks: { id: string; tasks: { id: string }[] }[]
  ): number => {
    const tasks = allWeeks
      .filter((w) => weekIds.includes(w.id))
      .flatMap((w) => w.tasks);
    if (tasks.length === 0) return 0;
    const done = tasks.filter((t) => getTaskStatus(t.id) === "done").length;
    return done / tasks.length;
  };

  return {
    hydrated,
    state,
    streak,
    setTaskStatus,
    setWeekNote,
    resetAll,
    getTaskStatus,
    getWeekProgress,
    getPhaseProgress,
    getNodeCompletion,
  };
}
