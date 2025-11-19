import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  const total = scores.reduce((acc, score) => acc + score, 0);
  return Math.round(total / scores.length);
}