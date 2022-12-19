import * as PIXI from 'pixi.js';
import { GameWorldDto, MapCellEdge, randomInt } from '@dotz/shared';
import { createTilesetSpriteSheet } from './createTilesetSpritesheet';
import { spritePaths } from './sprites';
import { Camera } from './createCamera';

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

export const createStage = async (
  app: PIXI.Application,
  gameWorld: GameWorldDto,
  camera: Camera
) => {
  console.log(gameWorld);
  const container = new PIXI.Container();

  const tilesetOptions = {
    path: spritePaths.tileSets.base,
    id: 'baseTileset',
    dimensions: {
      w: 32 * MAX_VARIANTS,
      h: 32 * 3 * MAX_TILES_PER_TERRAIN
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
    sprite.width = mapOptions.tileSize;
    sprite.height = mapOptions.tileSize;
    sprite.position.set(
      mapOptions.tileSize * (cellIndex % mapOptions.dimensions.w),
      mapOptions.tileSize * Math.floor(cellIndex / mapOptions.dimensions.h)
    );
    sprite.anchor.set(0.5);
    sprite.angle = cell.angle;
    sprite.cullable = true;
    container.addChild(sprite);
  });

  gameWorld.players.forEach(player => {
    console.log(player.position);
    const graphics = new PIXI.Graphics();
    graphics.beginFill(player.color);
    graphics.drawCircle(player.position.x, player.position.y, 16);
    graphics.endFill();
    container.addChild(graphics);
    camera.update({
      x: player.position.x,
      y: player.position.y
    });
  });

  app.stage.addChild(container);
};
