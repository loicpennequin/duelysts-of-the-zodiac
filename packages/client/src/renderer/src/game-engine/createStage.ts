import { randomInRange } from '@dotz/shared';
import { GameWorldDto, Values } from '@dotz/shared';
import { colord } from 'colord';
import * as PIXI from 'pixi.js';

const CELL_SIZE = 25;

const TerrainType = {
  DEEP_WATER: 'DEEP_WATER',
  WATER: 'WATER',
  SAND: 'SAND',
  GRASS: 'GRASS',
  LOW_MOUNTAIN: 'MOUNTAIN',
  HIGH_MOUNTAIN: 'HIGH_MOUNTAIN',
  SNOW: 'SNOW'
} as const;

type TerrainType = Values<typeof TerrainType>;

const NOISE_TO_TERRAIN_MAP: Record<number, TerrainType> = {
  0: TerrainType.DEEP_WATER,
  5: TerrainType.DEEP_WATER,
  10: TerrainType.DEEP_WATER,
  15: TerrainType.DEEP_WATER,
  20: TerrainType.DEEP_WATER,
  25: TerrainType.WATER,
  30: TerrainType.WATER,
  35: TerrainType.SAND,
  40: TerrainType.GRASS,
  45: TerrainType.GRASS,
  50: TerrainType.GRASS,
  55: TerrainType.GRASS,
  60: TerrainType.GRASS,
  65: TerrainType.LOW_MOUNTAIN,
  70: TerrainType.LOW_MOUNTAIN,
  75: TerrainType.HIGH_MOUNTAIN,
  80: TerrainType.HIGH_MOUNTAIN,
  85: TerrainType.HIGH_MOUNTAIN,
  90: TerrainType.HIGH_MOUNTAIN,
  95: TerrainType.SNOW,
  100: TerrainType.SNOW
};

const TERRAIN_LIGHTNESS_BOUNDARIES = {
  [TerrainType.DEEP_WATER]: { min: 15, max: 30 },
  [TerrainType.WATER]: { min: 35, max: 50 },
  [TerrainType.SAND]: { min: 60, max: 75 },
  [TerrainType.GRASS]: { min: 25, max: 45 },
  [TerrainType.LOW_MOUNTAIN]: { min: 15, max: 30 },
  [TerrainType.HIGH_MOUNTAIN]: { min: 10, max: 30 },
  [TerrainType.SNOW]: { min: 85, max: 95 }
} as const;

const mapCellToColor = (type: TerrainType) => {
  const lightness = Math.round(
    randomInRange({
      min: TERRAIN_LIGHTNESS_BOUNDARIES[type].min,
      max: TERRAIN_LIGHTNESS_BOUNDARIES[type].max
    })
  );

  switch (type) {
    case TerrainType.DEEP_WATER:
      return `hsla(230, 55%, ${lightness}%, 1)`;
    case TerrainType.WATER:
      return `hsla(245, 45%, ${lightness}%, 1)`;
    case TerrainType.SAND:
      return `hsla(50, 15%, ${lightness}%, 1)`;
    case TerrainType.GRASS:
      return `hsla(110, 50%, ${lightness}%, 1)`;
    case TerrainType.LOW_MOUNTAIN:
      return `hsla(45, 35%, ${lightness}%, 1)`;
    case TerrainType.HIGH_MOUNTAIN:
      return `hsla(30, 45%, ${lightness}%, 1)`;
    case TerrainType.SNOW:
      return `hsla(190, 0%, ${lightness}%, 1)`;
    default:
      throw new Error(`Wrong type provided to cell : ${type}`);
  }
};
export const createStage = async (
  app: PIXI.Application,
  gameWorld: GameWorldDto
) => {
  const graphics = new PIXI.Graphics();
  gameWorld.map.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const color = mapCellToColor(NOISE_TO_TERRAIN_MAP[cell]);

      const hexColor = PIXI.utils.string2hex(colord(color).toHex());

      graphics.beginFill(hexColor);
      graphics.drawRect(
        cellIndex * CELL_SIZE,
        rowIndex * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
      graphics.endFill();
    });
  });

  app.stage.addChild(graphics);
};
