import { Point } from "./point";

export type Circle = Point & {
    radius: number
}

export function getCopyOfCircle(circle: Circle): Circle {
    return {
        ...circle
    }
}

export const DEFAULT_CIRCLE: Circle = {
  x: 0,
  y: 0,
  radius: 0
}

export function getDefaultCircleForCopy(): Circle {
  return getCopyOfCircle(DEFAULT_CIRCLE);
}

export function areEqualCircles(f1: Circle | undefined, f2: Circle | undefined): boolean {
    return (isDefaultCircle(f1) && isDefaultCircle(f2)) || (f1?.x === f2?.x && f1?.y === f2?.y && f1?.radius === f2?.radius);
}

export function isDefaultCircle(o: Circle | undefined): boolean {
    return o === undefined || (o.x === 0 && o.y === 0 && o.radius === 0);
}
