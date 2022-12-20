import { Point, lerp } from '@dotz/shared';

export type InterPolationState<T extends Point> = {
  value: T;
  timestamp: number;
};

export type InterpolateOptions = {
  now?: number;
};

export const interpolateEntity = <T extends Point = Point>(
  newState: InterPolationState<T>,
  oldState: InterPolationState<T>,
  { now = performance.now() }: InterpolateOptions
): Point => {
  const target = now;
  const delta = target - newState.timestamp;
  const statesDelta = newState.timestamp - oldState.timestamp;
  let interpFactor = delta / statesDelta;

  if (interpFactor === Infinity) interpFactor = 1;

  return {
    x: lerp(interpFactor, { min: oldState.value.x, max: newState.value.x }),
    y: lerp(interpFactor, { min: oldState.value.y, max: newState.value.y })
  };
};
