export type SkinType = "dry" | "normal" | "combination" | "oily" | "sensitive";

export type Concern =
  | "hydration"
  | "dullness"
  | "redness"
  | "breakouts"
  | "fine-lines"
  | "dark-circles"
  | "uneven-tone"
  | "puffiness";

export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal"
  | "none";

export type RoutineSlot = "morning" | "midday" | "evening";

export type ProductCategory =
  | "cleanser"
  | "toner"
  | "serum"
  | "moisturizer"
  | "eye"
  | "spf"
  | "mask"
  | "exfoliant"
  | "oil"
  | "mist"
  | "lip"
  | "supplement"
  | "bodycare"
  | "haircare"
  | "fragrance"
  | "makeup-base"
  | "makeup-color";

export type ProductTag =
  | "hydrating"
  | "calming"
  | "brightening"
  | "barrier-repair"
  | "exfoliating"
  | "antioxidant"
  | "spf"
  | "anti-inflammatory"
  | "depuffing"
  | "balancing"
  | "ceramides"
  | "hyaluronic"
  | "vitamin-c"
  | "retinoid"
  | "niacinamide"
  | "peptides"
  | "azelaic"
  | "fragrance-free";

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: ProductCategory;
  tags: ProductTag[];
  notes?: string;
  price?: number;
  priceCurrency?: string;
  image?: string;
  source: "owned" | "suggested";
  addedAt: number;
  finishesIn?: number;
  url?: string;
}

export interface CheckIn {
  date: string;
  sleepHours: number;
  stress: number;
  hydrationGlasses: number;
  mood: "low" | "okay" | "bright" | "radiant";
  notes?: string;
}

export interface CycleData {
  lastPeriodStart: string | null;
  averageCycleLength: number;
  averagePeriodLength: number;
  tracking: boolean;
}

export interface UserProfile {
  name?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  skinType: SkinType;
  concerns: Concern[];
  cycle: CycleData;
  joinedAt: number;
  onboarded: boolean;
}

export interface ClimateContext {
  temperatureC: number | null;
  humidity: number | null;
  uvIndex: number | null;
  airQuality: number | null;
  condition: string;
  isDry: boolean;
  isHumid: boolean;
  isCold: boolean;
  isHot: boolean;
  isHighUv: boolean;
  isPolluted: boolean;
  source: "live" | "demo";
}

export interface AuraContextSnapshot {
  date: string;
  cyclePhase: CyclePhase;
  cycleDay: number | null;
  climate: ClimateContext;
  checkIn: CheckIn;
  needs: ProductTag[];
  warnings: string[];
  auraScore: number;
  scoreBreakdown: {
    sleep: number;
    stress: number;
    hydration: number;
    cycle: number;
    climate: number;
  };
}

export interface RoutineStep {
  slot: RoutineSlot;
  order: number;
  category: ProductCategory;
  rationale: string;
  product?: Product;
  suggestion?: Product;
}
