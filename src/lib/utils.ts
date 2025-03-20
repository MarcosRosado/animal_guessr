import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateScore (distance: number, maxDistance: number): number {
  if (distance === 0) return 1000;
  return Math.max(0, 1000 - (distance / maxDistance) * 1000);
}






