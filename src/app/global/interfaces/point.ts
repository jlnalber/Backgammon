export type Vector = Point;

export interface Point {
  x: number,
  y: number
}

export function getCopyOfPoint(p: Point): Point {
  return {
    ...p
  }
}

export const DEFAULT_POINT: Point = {
  x: 0,
  y: 0
}

export function getDefaultPointForCopy(): Point {
  return getCopyOfPoint(DEFAULT_POINT);
}

export function areEqualPoints(f1: Point | undefined, f2: Point | undefined): boolean {
    return (isDefaultPoint(f1) && isDefaultPoint(f2)) || (f1?.x === f2?.x && f1?.y === f2?.y);
}

export function isDefaultPoint(o: Point | undefined): boolean {
    return o === undefined || (o.x === 0 && o.y === 0);
}
