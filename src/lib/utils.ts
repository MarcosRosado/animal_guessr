/**
 * AnimalGuessr - Interactive Grid-Based Scoring App
 *
 * AnimalGuessr allows users to interact with a grid-based image and
 * calculate scores based on predefined criteria.
 *
 * Licensed under the GNU General Public License (GPL) v3.0 or later.
 * See LICENSE for details.
 *
 * Author: [Marcos Rosado]
 * Repository: [https://github.com/MarcosRosado/animal_guessr/]
 */


import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {StaticImport} from "next/dist/shared/lib/get-img-props";
import {useEffect, useState} from "react";
import Cookies from 'js-cookie';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateScore (distance: number, maxDistance: number): number {
  if (distance === 0) return 1000;
  return Math.max(0, 1000 - (distance / maxDistance) * 1000);
}

export async function importAssets (sampleNumber: number): Promise<{ image: StaticImport; json: never }> {
  const image = await import(`@assets/images/sample${sampleNumber}.png`);
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

export function usePageLoaded () {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setIsPageLoaded(true);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return isPageLoaded;
}

export function setCookieIfNotExists(cookieName: string, cookieValue: string, maxAge: number) {

  if (!Cookies.get(cookieName)) {
    Cookies.set(cookieName, cookieValue, { expires: maxAge * (24 * 60 * 60) }); // maxAge is in seconds, convert to days
  }
}

export function getCookie(cookieName: string) {
  return Cookies.get(cookieName) || "";
}





