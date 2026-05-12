"use client";

const KEY = "aura.state.v1";

export interface PersistedState {
  profile: import("./types").UserProfile;
  vanity: import("./types").Product[];
  history: Record<string, import("./types").CheckIn>;
}

export function loadState(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export function saveState(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // intentionally swallow quota / private mode errors
  }
}

export function clearState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
