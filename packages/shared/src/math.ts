import type { Point, Range } from './types';

export const cartesianToIsometric = (point: Point) => ({
  x: point.x - point.y,
  y: point.x + point.y
});

export const clamp = (num: number, { min, max }: Range) =>
  Math.min(Math.max(num, min), max);

export const mapRange = (num: number, inRange: Range, outRange: Range) => {
  const mapped: number =
    ((num - inRange.min) * (outRange.max - outRange.min)) /
      (inRange.max - inRange.min) +
    outRange.min;

  return clamp(mapped, { min: outRange.min, max: outRange.max });
};
