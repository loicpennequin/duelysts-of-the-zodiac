import type { Point, Range } from './types';

export const cartesianToIsometric = (point: Point) => ({
  x: point.x - point.y,
  y: point.x + point.y
});

export const clamp = (num: number, { min, max }: Range) =>
  Math.min(Math.max(num, min), max);
