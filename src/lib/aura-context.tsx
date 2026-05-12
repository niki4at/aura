"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { STARTER_VANITY } from "./catalog";
import {
  buildSnapshot,
  DEFAULT_CHECKIN,
  DEFAULT_CLIMATE,
} from "./engine";
import { loadState, saveState, type PersistedState } from "./storage";
import type {
  AuraContextSnapshot,
  CheckIn,
  ClimateContext,
  Product,
  UserProfile,
} from "./types";

const DEFAULT_PROFILE: UserProfile = {
  name: undefined,
  city: undefined,
  country: undefined,
  countryCode: undefined,
  latitude: undefined,
  longitude: undefined,
  skinType: "combination",
  concerns: ["hydration", "dullness"],
  cycle: {
    lastPeriodStart: null,
    averageCycleLength: 28,
    averagePeriodLength: 5,
    tracking: false,
  },
  joinedAt: Date.now(),
  onboarded: false,
};

interface AuraStateContextValue {
  profile: UserProfile;
  vanity: Product[];
  history: Record<string, CheckIn>;
  todayCheckIn: CheckIn;
  climate: ClimateContext;
  snapshot: AuraContextSnapshot;
  isHydrated: boolean;
  isClimateLoading: boolean;
  updateProfile: (next: Partial<UserProfile>) => void;
  setCheckIn: (next: CheckIn) => void;
  resetAll: () => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  importProduct: (product: Product) => void;
  refreshClimate: () => Promise<void>;
}

const Ctx = createContext<AuraStateContextValue | null>(null);

const today = () => new Date().toISOString().slice(0, 10);

function makeInitialState(): PersistedState {
  return {
    profile: DEFAULT_PROFILE,
    vanity: STARTER_VANITY,
    history: { [today()]: DEFAULT_CHECKIN },
  };
}

export function AuraProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(makeInitialState);
  const [climate, setClimate] = useState<ClimateContext>(DEFAULT_CLIMATE);
  const [isHydrated, setHydrated] = useState(false);
  const [isClimateLoading, setClimateLoading] = useState(false);

  useEffect(() => {
    const persisted = loadState();
    if (persisted) {
      const t = today();
      setState({
        ...persisted,
        history: persisted.history[t]
          ? persisted.history
          : { ...persisted.history, [t]: DEFAULT_CHECKIN },
      });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveState(state);
  }, [state, isHydrated]);

  const fetchClimate = useCallback(
    async (lat?: number, lon?: number) => {
      try {
        setClimateLoading(true);
        const params = new URLSearchParams();
        if (lat != null && lon != null) {
          params.set("lat", String(lat));
          params.set("lon", String(lon));
        } else if (state.profile.city) {
          params.set("city", state.profile.city);
        }
        const res = await fetch(`/api/climate?${params.toString()}`);
        if (!res.ok) throw new Error("climate fetch failed");
        const data = (await res.json()) as ClimateContext & {
          city?: string;
          country?: string;
          countryCode?: string;
        };
        setClimate(data);
        if (data.city || data.country) {
          setState((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              city: data.city ?? prev.profile.city,
              country: data.country ?? prev.profile.country,
              countryCode: data.countryCode ?? prev.profile.countryCode,
              latitude: lat ?? prev.profile.latitude,
              longitude: lon ?? prev.profile.longitude,
            },
          }));
        }
      } catch {
        setClimate(DEFAULT_CLIMATE);
      } finally {
        setClimateLoading(false);
      }
    },
    [state.profile.city],
  );

  useEffect(() => {
    if (!isHydrated) return;
    if (state.profile.latitude && state.profile.longitude) {
      void fetchClimate(state.profile.latitude, state.profile.longitude);
    } else if (state.profile.city) {
      void fetchClimate();
    }
  }, [
    isHydrated,
    state.profile.latitude,
    state.profile.longitude,
    state.profile.city,
    fetchClimate,
  ]);

  const todayKey = today();
  const todayCheckIn = state.history[todayKey] ?? DEFAULT_CHECKIN;

  const snapshot = useMemo(
    () => buildSnapshot(state.profile, todayCheckIn, climate),
    [state.profile, todayCheckIn, climate],
  );

  const value: AuraStateContextValue = {
    profile: state.profile,
    vanity: state.vanity,
    history: state.history,
    todayCheckIn,
    climate,
    snapshot,
    isHydrated,
    isClimateLoading,
    updateProfile(next) {
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...next },
      }));
    },
    setCheckIn(next) {
      setState((prev) => ({
        ...prev,
        history: { ...prev.history, [next.date]: next },
      }));
    },
    resetAll() {
      setState(makeInitialState());
      setClimate(DEFAULT_CLIMATE);
    },
    addProduct(product) {
      setState((prev) => ({
        ...prev,
        vanity: [
          { ...product, source: "owned", addedAt: Date.now() },
          ...prev.vanity.filter((p) => p.id !== product.id),
        ],
      }));
    },
    removeProduct(id) {
      setState((prev) => ({
        ...prev,
        vanity: prev.vanity.filter((p) => p.id !== id),
      }));
    },
    importProduct(product) {
      setState((prev) => {
        if (prev.vanity.some((p) => p.id === product.id)) return prev;
        return {
          ...prev,
          vanity: [
            { ...product, source: "owned", addedAt: Date.now() },
            ...prev.vanity,
          ],
        };
      });
    },
    refreshClimate: () => fetchClimate(),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAura() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAura must be used inside <AuraProvider>");
  return ctx;
}
