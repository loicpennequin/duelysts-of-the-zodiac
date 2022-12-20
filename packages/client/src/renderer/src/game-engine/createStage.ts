import * as PIXI from 'pixi.js';
import { GameWorldDto, MapCellEdge, randomInt } from '@dotz/shared';
import { createTilesetSpriteSheet } from './createTilesetSpritesheet';
import { spritePaths } from './sprites';

const VARIANTS_BY_EDGES = {
  [MapCellEdge.NONE]: 4,
  [MapCellEdge.ONE_SIDE]: 1,
  [MapCellEdge.TWO_SIDES]: 1,
  [MapCellEdge.THREE_SIDES]: 1,
  [MapCellEdge.ALL_SIDES]: 1,
  [MapCellEdge.CORNER]: 1
} as const;
const MAX_VARIANTS = Math.max(...Object.values(VARIANTS_BY_EDGES));

const MAX_TILES_PER_TERRAIN = 6;
const TERRAINS_COUNT = 5;
export const createStage = async (
  app: PIXI.Application,
  gameWorld: GameWorldDto
) => {
  const container = new PIXI.Container();

  const tilesetOptions = {
    path: spritePaths.tileSets.base,
    id: 'baseTileset',
    dimensions: {
      w: 32 * MAX_VARIANTS,
      h: 32 * TERRAINS_COUNT * MAX_TILES_PER_TERRAIN
    },
    tileSize: 32
  };

  const mapOptions = {
    dimensions: { w: gameWorld.map.width, h: gameWorld.map.height },
    tileSize: 32
  };

  const sheet = await createTilesetSpriteSheet(tilesetOptions);

  gameWorld.map.cells.forEach((cell, cellIndex) => {
    const variant = randomInt(VARIANTS_BY_EDGES[cell.edge] - 1);
    const tileIndex =
      (cell.terrain * MAX_TILES_PER_TERRAIN + cell.edge) * MAX_VARIANTS +
      variant;

    const sprite = new PIXI.Sprite(
      sheet.textures[`${tilesetOptions.id}-${tileIndex}`]
    );
    // we add a small offset to the size and position to overlap the tiles because of PIXI aliasing issues at certain scales
    sprite.width = mapOptions.tileSize + 0.02;
    sprite.height = mapOptions.tileSize + 0.02;
    sprite.position.set(
      mapOptions.tileSize * (cellIndex % mapOptions.dimensions.w) - 0.01,
      mapOptions.tileSize * Math.floor(cellIndex / mapOptions.dimensions.h) -
        0.01
    );
    sprite.anchor.set(0.5);
    sprite.angle = cell.angle;
    sprite.cullable = true;
    container.addChild(sprite);
  });

  app.stage.addChild(container);
};
