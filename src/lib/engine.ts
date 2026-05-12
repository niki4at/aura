import { SUGGESTED_CATALOG } from "./catalog";
import type {
  AuraContextSnapshot,
  CheckIn,
  ClimateContext,
  CyclePhase,
  Product,
  ProductCategory,
  ProductTag,
  RoutineStep,
  UserProfile,
} from "./types";

export const DEFAULT_CHECKIN: CheckIn = {
  date: new Date().toISOString().slice(0, 10),
  sleepHours: 7,
  stress: 4,
  hydrationGlasses: 5,
  mood: "okay",
};

export const DEFAULT_CLIMATE: ClimateContext = {
  temperatureC: 16,
  humidity: 42,
  uvIndex: 4,
  airQuality: 35,
  condition: "Partly cloudy",
  isDry: true,
  isHumid: false,
  isCold: false,
  isHot: false,
  isHighUv: false,
  isPolluted: false,
  source: "demo",
};

export function computeClimateFlags(c: ClimateContext): ClimateContext {
  const isDry = c.humidity != null ? c.humidity < 45 : false;
  const isHumid = c.humidity != null ? c.humidity > 70 : false;
  const isCold = c.temperatureC != null ? c.temperatureC < 10 : false;
  const isHot = c.temperatureC != null ? c.temperatureC > 26 : false;
  const isHighUv = c.uvIndex != null ? c.uvIndex >= 6 : false;
  const isPolluted = c.airQuality != null ? c.airQuality > 80 : false;
  return { ...c, isDry, isHumid, isCold, isHot, isHighUv, isPolluted };
}

export function computeCyclePhase(
  profile: UserProfile,
  today = new Date(),
): { phase: CyclePhase; day: number | null } {
  if (
    !profile.cycle.tracking ||
    !profile.cycle.lastPeriodStart ||
    !profile.cycle.averageCycleLength
  ) {
    return { phase: "none", day: null };
  }
  const start = new Date(profile.cycle.lastPeriodStart);
  if (Number.isNaN(start.getTime())) return { phase: "none", day: null };
  const len = profile.cycle.averageCycleLength;
  const periodLen = profile.cycle.averagePeriodLength;
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.floor((today.getTime() - start.getTime()) / msPerDay);
  const day = ((diff % len) + len) % len + 1;

  let phase: CyclePhase = "follicular";
  if (day <= periodLen) phase = "menstrual";
  else if (day <= 13) phase = "follicular";
  else if (day <= 16) phase = "ovulation";
  else phase = "luteal";

  return { phase, day };
}

const phaseNeeds: Record<CyclePhase, ProductTag[]> = {
  menstrual: ["hydrating", "calming", "barrier-repair"],
  follicular: ["brightening", "antioxidant", "vitamin-c"],
  ovulation: ["balancing", "niacinamide"],
  luteal: ["calming", "anti-inflammatory", "azelaic"],
  none: [],
};

const phaseLabels: Record<CyclePhase, string> = {
  menstrual: "Menstrual",
  follicular: "Follicular",
  ovulation: "Ovulation",
  luteal: "Luteal",
  none: "Not tracked",
};

const phaseCopy: Record<CyclePhase, string> = {
  menstrual: "Lower your acid load. Lean into hydrating, soothing layers.",
  follicular:
    "Estrogen is rising — skin tolerates more. A great window for vitamin C and gentle exfoliation.",
  ovulation: "Sebum peaks. Balance and refine without stripping.",
  luteal:
    "Progesterone can trigger breakouts and dullness. Calming actives over scrubbing.",
  none: "Cycle tracking is off. Recommendations are climate-led.",
};

export function getPhaseLabel(phase: CyclePhase) {
  return phaseLabels[phase];
}

export function getPhaseCopy(phase: CyclePhase) {
  return phaseCopy[phase];
}

export function deriveNeeds(
  checkIn: CheckIn,
  climate: ClimateContext,
  phase: CyclePhase,
): { needs: ProductTag[]; warnings: string[] } {
  const needs = new Set<ProductTag>();
  const warnings: string[] = [];

  if (checkIn.sleepHours < 6) {
    needs.add("brightening");
    needs.add("depuffing");
    needs.add("antioxidant");
    warnings.push("Short sleep — go gentler on actives tonight.");
  } else if (checkIn.sleepHours < 7) {
    needs.add("brightening");
    needs.add("depuffing");
  }

  if (checkIn.stress >= 7) {
    needs.add("calming");
    needs.add("anti-inflammatory");
    needs.add("barrier-repair");
    warnings.push("High stress today — pause exfoliation, focus on barrier.");
  } else if (checkIn.stress >= 5) {
    needs.add("calming");
  }

  if (checkIn.hydrationGlasses < 4) {
    needs.add("hydrating");
    needs.add("hyaluronic");
    warnings.push("Low water intake — layer a humectant under your moisturizer.");
  }

  if (climate.isDry || climate.isCold) {
    needs.add("hydrating");
    needs.add("ceramides");
    needs.add("barrier-repair");
  }
  if (climate.isHumid || climate.isHot) {
    needs.add("balancing");
    needs.add("niacinamide");
  }
  if (climate.isHighUv) {
    needs.add("spf");
    needs.add("antioxidant");
  }
  if (climate.isPolluted) {
    needs.add("antioxidant");
    needs.add("vitamin-c");
  }

  for (const t of phaseNeeds[phase]) needs.add(t);

  if (climate.isHot && checkIn.stress >= 7) {
    warnings.push("Hot + stressed — skip retinoids and acids tonight.");
  }
  if (climate.isHighUv) {
    warnings.push("UV index is high. SPF reapply at midday is non-negotiable.");
  }

  return { needs: Array.from(needs), warnings };
}

export function computeAuraScore(
  checkIn: CheckIn,
  climate: ClimateContext,
  phase: CyclePhase,
) {
  const sleep = clamp((checkIn.sleepHours / 8) * 25, 0, 25);
  const stress = clamp((1 - (checkIn.stress - 1) / 9) * 20, 0, 20);
  const hydration = clamp((checkIn.hydrationGlasses / 8) * 20, 0, 20);
  const cycle = phase === "follicular" || phase === "ovulation" ? 18 : phase === "none" ? 14 : 12;
  let climateScore = 17;
  if (climate.isDry) climateScore -= 3;
  if (climate.isCold) climateScore -= 2;
  if (climate.isHot) climateScore -= 2;
  if (climate.isHighUv) climateScore -= 2;
  if (climate.isPolluted) climateScore -= 2;
  climateScore = clamp(climateScore, 0, 17);
  const total = Math.round(sleep + stress + hydration + cycle + climateScore);
  return {
    total,
    breakdown: {
      sleep: Math.round(sleep),
      stress: Math.round(stress),
      hydration: Math.round(hydration),
      cycle: Math.round(cycle),
      climate: Math.round(climateScore),
    },
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function buildSnapshot(
  profile: UserProfile,
  checkIn: CheckIn,
  climate: ClimateContext,
): AuraContextSnapshot {
  const flagged = computeClimateFlags(climate);
  const { phase, day } = computeCyclePhase(profile);
  const { needs, warnings } = deriveNeeds(checkIn, flagged, phase);
  const { total, breakdown } = computeAuraScore(checkIn, flagged, phase);
  return {
    date: new Date().toISOString().slice(0, 10),
    cyclePhase: phase,
    cycleDay: day,
    climate: flagged,
    checkIn,
    needs,
    warnings,
    auraScore: total,
    scoreBreakdown: breakdown,
  };
}

const MORNING_FLOW: ProductCategory[] = [
  "cleanser",
  "toner",
  "serum",
  "eye",
  "moisturizer",
  "spf",
];
const EVENING_FLOW: ProductCategory[] = [
  "cleanser",
  "exfoliant",
  "toner",
  "serum",
  "eye",
  "moisturizer",
  "oil",
];
const MIDDAY_FLOW: ProductCategory[] = ["mist", "spf", "lip"];

const categoryRationale: Partial<Record<ProductCategory, string>> = {
  cleanser: "Reset before layering anything.",
  toner: "Prep with an essence — thirsty skin grabs the next steps better.",
  serum: "Targeted active aligned with today's needs.",
  eye: "Cooling cushion for the under-eye.",
  moisturizer: "Seal the layers in.",
  spf: "Non-negotiable, especially with today's UV.",
  exfoliant: "Gentle resurface — skip if barrier is reactive.",
  oil: "Two drops over moisturizer for that lit-from-within finish.",
  mist: "Quick mid-day reset for parched skin.",
  lip: "Don't forget the lips.",
  mask: "Treatment layer — use at night, no rinse needed.",
};

function scoreProduct(product: Product, needs: ProductTag[]): number {
  if (needs.length === 0) return 1;
  const hits = product.tags.filter((t) => needs.includes(t)).length;
  return hits;
}

function pickBest(
  category: ProductCategory,
  needs: ProductTag[],
  pool: Product[],
  excludeIds: Set<string>,
) {
  const candidates = pool
    .filter((p) => p.category === category && !excludeIds.has(p.id))
    .map((p) => ({ p, score: scoreProduct(p, needs) }))
    .sort((a, b) => b.score - a.score);
  return candidates[0]?.p;
}

export function buildRoutine(
  snapshot: AuraContextSnapshot,
  ownedProducts: Product[],
): RoutineStep[] {
  const steps: RoutineStep[] = [];
  const usedOwned = new Set<string>();
  const skipExfoliant =
    snapshot.warnings.some((w) => /barrier|stress/i.test(w)) ||
    snapshot.cyclePhase === "menstrual";

  function addFlow(slot: "morning" | "midday" | "evening", flow: ProductCategory[]) {
    let order = 1;
    for (const cat of flow) {
      if (cat === "exfoliant" && skipExfoliant) continue;
      if (cat === "spf" && slot === "evening") continue;
      const owned = pickBest(cat, snapshot.needs, ownedProducts, usedOwned);
      let suggestion: Product | undefined;
      if (!owned) {
        suggestion = pickBest(cat, snapshot.needs, SUGGESTED_CATALOG, new Set());
      }
      if (owned) usedOwned.add(owned.id);
      steps.push({
        slot,
        order: order++,
        category: cat,
        rationale: categoryRationale[cat] ?? "",
        product: owned,
        suggestion,
      });
    }
  }

  addFlow("morning", MORNING_FLOW);
  addFlow("midday", MIDDAY_FLOW);
  addFlow("evening", EVENING_FLOW);

  return steps;
}

export function discoverSuggestions(
  snapshot: AuraContextSnapshot,
  ownedProducts: Product[],
  limit = 8,
): { product: Product; reason: string; matched: ProductTag[] }[] {
  const ownedCategories = new Set(ownedProducts.map((p) => p.category));
  const ownedTags = new Set(ownedProducts.flatMap((p) => p.tags));

  return SUGGESTED_CATALOG.map((p) => {
    const matched = p.tags.filter((t) => snapshot.needs.includes(t));
    let score = matched.length * 2;
    if (!ownedCategories.has(p.category)) score += 1;
    const novelTags = p.tags.filter((t) => !ownedTags.has(t)).length;
    score += novelTags * 0.3;
    let reason = "";
    if (matched.length > 0) {
      reason = `Matches today's need for ${matched.slice(0, 2).join(" + ")}.`;
    } else if (!ownedCategories.has(p.category)) {
      reason = `Fills a gap — you don't own a ${p.category} yet.`;
    } else {
      reason = "An upgrade pick from your style.";
    }
    return { product: p, reason, matched, score };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product, reason, matched }) => ({ product, reason, matched }));
}
