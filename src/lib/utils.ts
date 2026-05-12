import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function firstSliderValue(
  v: number | readonly number[],
  fallback: number,
): number {
  if (Array.isArray(v)) {
    return typeof v[0] === "number" ? v[0] : fallback
  }
  return typeof v === "number" ? v : fallback
}
