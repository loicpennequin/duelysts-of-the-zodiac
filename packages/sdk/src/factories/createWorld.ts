import { makeNoise2D } from 'open-simplex-noise';
import { makeRectangle } from 'fractal-noise';
import { type Matrix, mapRange } from '@dotz/shared';

const WIDTH = 100;
const HEIGHT = 100;
const SEED = 12345;

export type GameWorld = {
  map: Matrix<number>;
  playerIds: string[];
};

const noiseToTileId = (noise: number) => {
  const normalized = mapRange(noise, { min: -1, max: 1 }, { min: 0, max: 1 });
  return (Math.round(normalized * 20) / 2) * 10;
};

export const createWorld = (playerIds: string[]): GameWorld => {
  const noise = makeNoise2D(SEED);

  const noiseMatrix = makeRectangle(WIDTH, HEIGHT, noise, {
    octaves: 8,
    frequency: 0.05,
    amplitude: 2
  }) as unknown as Matrix<number>; // types are literally wrong in the lib source code smh, see https://github.com/joshforisha/fractal-noise-js/blob/main/src/mod.ts#L127

  const map = noiseMatrix.map(row => row.map(noiseToTileId));
  console.log('map generated');
  return { map, playerIds };
};
