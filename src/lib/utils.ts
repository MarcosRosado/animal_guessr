import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {StaticImport} from "next/dist/shared/lib/get-img-props";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateScore (distance: number, maxDistance: number): number {
  if (distance === 0) return 1000;
  return Math.max(0, 1000 - (distance / maxDistance) * 1000);
}

export async function importAssets (sampleNumber: number): Promise<{ image: StaticImport; json: never }> {
  const image = await import(`@assets/images/sample${sampleNumber}.jpg`);
  const json = await import(`@assets/dataset/sample${sampleNumber}.json`) as never;
  return { image, json };
}

export async function loadAllAssets (numSamples: number) {
  const assetPromises = [];
  for (let i = 1; i <= numSamples; i++) {
    assetPromises.push(importAssets(i));
  }
  return await Promise.all(assetPromises);
}






