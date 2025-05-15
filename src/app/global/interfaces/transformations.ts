export const DEFAULT_RESOLUTIONFACTOR = 1;

export interface Transformations {
  translateX: number,
  translateY: number,
  zoom: number,
  resolutionFactor?: Resolution
}

export type Resolution = number | number[];

export function getResolution(res?: Resolution, level?: number): number {
  const l = level ?? 0;
  if (typeof res === 'number') {
    return res;
  }
  else if (res === undefined || res.length === 0) {
    return DEFAULT_RESOLUTIONFACTOR;
  }
  else if (l < res.length) {
    return res[l];
  }
  else {
    return res[0];
  }
}
