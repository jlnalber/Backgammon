import { Point } from "./point";

export type Vector = {
    x: number,
    y: number,
    z: number
}

export function getCosineBetweenVectors(v1: Vector, v2: Vector): number {
    return getScalarProduct(v1, v2) / (getAbsOfVector(v1) * getAbsOfVector(v2));
}

export function getAbsOfVector(v: Vector): number {
    return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}

export function getScalarProduct(v1: Vector, v2: Vector): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

export function rotateVectorAroundXAxis(angle: number, vector: Vector): Vector {
    return {
        x: vector.x,
        y: vector.y * Math.cos(angle) - vector.z * Math.sin(angle),
        z: vector.y * Math.sin(angle) + vector.z * Math.cos(angle)
    }
}

export function rotateVectorAroundYAxis(angle: number, vector: Vector): Vector {
    return {
        x: vector.x * Math.cos(angle) + vector.z * Math.sin(angle),
        y: vector.y,
        z: -vector.x * Math.sin(angle) + vector.z * Math.cos(angle)
    }
}

export function rotateVectorAroundZAxis(angle: number, vector: Vector): Vector {
    return {
        x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle),
        z: vector.z
    }
}

export function vectorToNorm(vector: Vector): Vector {
    const abs = getAbsOfVector(vector);
    return {
        x: vector.x / abs,
        y: vector.y / abs,
        z: vector.z / abs
    }
}

export function vectorProduct(v1: Vector, v2: Vector): Vector {
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
    }
}

export function getVectorFromPoints(p1: Point, p2: Point): Vector {
    return {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
        z: 0
    }
}