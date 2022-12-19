import type { MapCellAngle } from '@dotz/shared';
import { isNever } from '@dotz/shared';
import {
  mapRange,
  type MapLayout,
  type Matrix,
  type MapCell,
  type Nullable,
  type Values,
  isDefined,
  MapCellEdge
} from '@dotz/shared';
import { makeRectangle } from 'fractal-noise';
import { makeNoise2D } from 'open-simplex-noise';

type TerrainMap = Terrain[];

type Terrain = Values<typeof TERRAINS>;
type CellNeighbors = {
  top: Nullable<Terrain>;
  bottom: Nullable<Terrain>;
  left: Nullable<Terrain>;
  right: Nullable<Terrain>;
};

const WIDTH = 50;
const HEIGHT = 50;
// const SEED = 12345;
const TERRAINS = {
  WATER: 0,
  SAND: 1,
  GRASS: 2
} as const;

const TERRAIN_DISTRIBUTION_MAP = {
  0: TERRAINS.WATER,
  5: TERRAINS.WATER,
  10: TERRAINS.WATER,
  15: TERRAINS.WATER,
  20: TERRAINS.WATER,
  25: TERRAINS.WATER,
  30: TERRAINS.WATER,
  35: TERRAINS.SAND,
  40: TERRAINS.SAND,
  45: TERRAINS.SAND,
  50: TERRAINS.GRASS,
  55: TERRAINS.GRASS,
  60: TERRAINS.GRASS,
  65: TERRAINS.GRASS,
  70: TERRAINS.GRASS,
  75: TERRAINS.GRASS,
  80: TERRAINS.GRASS,
  85: TERRAINS.GRASS,
  90: TERRAINS.GRASS,
  95: TERRAINS.GRASS,
  100: TERRAINS.GRASS
} as const;

const makeTerrainMap = (): TerrainMap => {
  const noise2D = makeNoise2D(Date.now());

  const heightMap = makeRectangle(WIDTH, HEIGHT, (x, y) => noise2D(x, y), {
    frequency: 0.08,
    octaves: 8,
    amplitude: 2
  }) as unknown as Matrix<number>; // ...the types of the libraryitself are wrong...ahem

  let map = heightMap
    .flat()
    .map(val => TERRAIN_DISTRIBUTION_MAP[normalizeHeight(val)]);

  let needsAdjustmentPass = true;
  let passCount = 0;
  const MAX_PASSES = 100;

  const doAdjustmentPass = () => {
    needsAdjustmentPass = false;
    passCount++;

    const newMap = map.map((terrain, index) => {
      const neighbors = getNeighbors(index, map);
      let adjustedTerrain: Nullable<Terrain> = null;

      Object.values(neighbors)
        .filter(isDefined)
        .forEach(nTerrain => {
          if (isDefined(adjustedTerrain)) return;

          const diff = terrain - nTerrain;
          if (!(Math.abs(diff) > 1)) return;

          needsAdjustmentPass = true;
          const adj = diff > 0 ? -1 : 1;

          adjustedTerrain = (terrain + adj) as Terrain;
        });

      return adjustedTerrain ?? terrain;
    });

    map = newMap;
  };

  while (needsAdjustmentPass && passCount < MAX_PASSES) {
    doAdjustmentPass();
  }

  return map;
};

const normalizeHeight = (
  height: number
): keyof typeof TERRAIN_DISTRIBUTION_MAP => {
  const normalized = mapRange(height, { min: -1, max: 1 }, { min: 0, max: 1 });

  return ((Math.round(normalized * 20) / 2) *
    10) as keyof typeof TERRAIN_DISTRIBUTION_MAP;
};

const getNeighbors = (index: number, map: TerrainMap): CellNeighbors => {
  const isLeftEdge = index % WIDTH === 0;
  const isRightEdge = index % WIDTH === WIDTH - 1;
  const isTopEdge = index < WIDTH;
  const isBottomEdge = map.length - 1 - index < WIDTH;

  return {
    top: isTopEdge ? null : map[index - WIDTH],
    bottom: isBottomEdge ? null : map[index + WIDTH],
    left: isLeftEdge ? null : map[index - 1],
    right: isRightEdge ? null : map[index + 1]
  };
};

const countEdges = (edges: [boolean, boolean, boolean, boolean]) =>
  edges.filter(edge => !!edge).length as Exclude<
    MapCellEdge,
    typeof MapCellEdge['CORNER']
  >;

const computeEdges = (
  index: number,
  map: TerrainMap
): Pick<MapCell, 'edge' | 'angle'> => {
  const cell = map[index];
  const neighbors = getNeighbors(index, map);

  const edges: [boolean, boolean, boolean, boolean] = [
    isDefined(neighbors.top) && neighbors.top < cell,
    isDefined(neighbors.bottom) && neighbors.bottom < cell,
    isDefined(neighbors.left) && neighbors.left < cell,
    isDefined(neighbors.right) && neighbors.right < cell
  ];
  const [isTopEdge, isBottomEdge, isLeftEdge, isRightEdge] = edges;
  const edgesCount = countEdges(edges);

  const isParallelTwoSides =
    edgesCount === 2 &&
    ((isTopEdge && isBottomEdge) || (isLeftEdge && isRightEdge));

  const computeAngleOneSide = (): MapCellAngle => {
    if (isLeftEdge) return 0;
    if (isTopEdge) return 90;
    if (isRightEdge) return 180;
    return 270;
  };

  const computeAngleTwoSides = (): MapCellAngle => {
    if (isParallelTwoSides) return isLeftEdge ? 0 : 90;
    if (isLeftEdge && isTopEdge) return 0;
    if (isTopEdge && isRightEdge) return 90;
    if (isRightEdge && isBottomEdge) return 180;

    return 270;
  };

  const computeAngleThreeSides = (): MapCellAngle => {
    if (!isTopEdge) return 0;
    if (!isRightEdge) return 90;
    if (!isBottomEdge) return 180;
    return 270;
  };

  switch (edgesCount) {
    case MapCellEdge.NONE:
      return { edge: edgesCount, angle: 0 };
    case MapCellEdge.ONE_SIDE:
      return { edge: edgesCount, angle: computeAngleOneSide() };
    case MapCellEdge.TWO_SIDES:
      return {
        edge: isParallelTwoSides ? edgesCount : MapCellEdge.CORNER,
        angle: computeAngleTwoSides()
      };
    case MapCellEdge.THREE_SIDES:
      return { edge: edgesCount, angle: computeAngleThreeSides() };
    case MapCellEdge.ALL_SIDES:
      return { edge: edgesCount, angle: 0 };
    default:
      isNever(edgesCount);
  }
};

const makeCell = (index: number, map: TerrainMap): MapCell => {
  return {
    terrain: map[index],
    ...computeEdges(index, map)
  };
};

export const createMap = (): MapLayout => {
  const terrainMap = makeTerrainMap();

  return {
    width: WIDTH,
    height: HEIGHT,
    cells: terrainMap.map((_, index) => makeCell(index, terrainMap))
  };
};
