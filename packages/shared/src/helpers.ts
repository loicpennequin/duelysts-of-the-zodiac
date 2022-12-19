import type { Size, Point, Matrix, AnyConstructor, Boundaries } from './types';

export const indexBy = <T extends Record<string, any>>(
  arr: T[],
  key: keyof T
) =>
  Object.fromEntries(arr.map(item => [item[key], item])) as Record<string, T>;

export const uniqBy = <T>(arr: T[], getKey: (item: T) => string): T[] => {
  const uniq: Record<string, T> = {};

  for (const item of arr) {
    const val = getKey(item);
    if (uniq[val]) continue;
    uniq[val] = item;
  }

  return Object.values(uniq);
};

export const createMatrix = <T>(
  dimensions: Size,
  initialValue: (coords: Point) => T
): Matrix<T> =>
  Array.from({ length: dimensions.w }, (_, x) =>
    Array.from({ length: dimensions.h }, (_, y) => initialValue({ x, y }))
  );

export const rotateMatrix = <T>(
  matrix: Matrix<T>,
  angle: number
): Matrix<T> => {
  if (angle % 90 !== 0) {
    throw new Error('Invalid input; degrees must be a multiple of 90');
  }

  const deg = ((angle % 360) + 360) % 360;
  const w = matrix.length;
  const h = matrix[0].length;

  let newMatrix = new Array(h);

  if (deg === 90) {
    for (let y = 0; y < h; y++) {
      newMatrix[y] = new Array(w);
      for (let x = 0; x < w; x++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        newMatrix[y][x] = matrix[w - 1 - x][y];
      }
    }
  } else if (deg === 180) {
    for (let y = 0; y < h; y++) {
      const n = h - 1 - y;
      newMatrix[n] = new Array(w);
      for (let x = 0; x < w; x++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        newMatrix[n][w - 1 - x] = matrix[y][x];
      }
    }
  } else if (deg === 270) {
    for (let y = 0; y < h; y++) {
      newMatrix[y] = new Array(w);
      for (let x = 0; x < w; x++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        newMatrix[y][x] = matrix[x][h - 1 - y];
      }
    }
  } else {
    newMatrix = matrix;
  }

  return newMatrix as Matrix<T>;
};

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout>;

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const throttle = (fn: Function, wait = 300) => {
  let inThrottle: boolean,
    lastFn: ReturnType<typeof setTimeout>,
    lastTime: number;
  return function (this: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-this-alias
    const context = this,
      // eslint-disable-next-line prefer-rest-params
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};

export const pipeBuilder = <A, B>(fn: (a: A) => B) => {
  return {
    add: <C>(g: (x: B) => C) => pipeBuilder((arg: A) => g(fn(arg))),
    build: (a?: A) => fn(a as A)
  };
};

export const mixinBuilder = <TBase extends AnyConstructor>(BaseClass: TBase) =>
  pipeBuilder(() => BaseClass);

export const noop = () => void 0;

export const memoize = <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn
) => {
  const cache = new Map<string, TReturn>();

  return (...args: TArgs) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key) as TReturn;

    const val = fn(...args);
    cache.set(key, val);

    return val;
  };
};

export class EmptyClass {}

export const random = (max: number) => Math.random() * max;

export const randomInt = (max: number) => Math.round(random(max));

export const randomInRange = ({ min, max }: Boundaries) =>
  min + Math.random() * (max - min);

export function randomIntExcluding(max: number, excluded: number[]) {
  const available = [];
  for (let i = 0; i <= max; i++) {
    if (!excluded.includes(i)) available.push(i);
  }

  return available[randomInt(available.length)];
}

type WeightedRandomChoice<T> = {
  value: T;
  weight: number;
};
export const weightedRandom = <T>(choices: WeightedRandomChoice<T>[]): T => {
  const weights = choices.map(
    (choice, index) => choice.weight + (choices[index - 1]?.weight ?? 0)
  );
  const int = randomInt(weights.at(-1) as number);
  const index = weights.findIndex(weight => weight >= int)!;

  return choices[index].value;
};
