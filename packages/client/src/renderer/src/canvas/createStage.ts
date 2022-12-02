import { Stage } from '@dotz/sdk';
import {
  type Point,
  mulVector,
  cartesianToIsometric,
  divVector,
  addVector
} from '@dotz/shared';
import * as PIXI from 'pixi.js';

const createTilesetSpriteSheet = async (stage: Stage) => {
  const { tileset } = stage;
  const texture = await PIXI.Assets.load(`/tilesets/${tileset.image}`);

  const data = {
    frames: Object.fromEntries(
      Array.from({ length: tileset.tilecount }, (_, index) => {
        // avoids console warnings with HMR
        if (import.meta.env.DEV) {
          PIXI.Texture.removeFromCache(`${stage.id}-${index + 1}`);
        }

        return [
          `${stage.id}-${index + 1}`,
          {
            frame: {
              x: (index % tileset.columns) * tileset.tilewidth,
              y: Math.floor(index / tileset.columns) * tileset.tileheight,
              w: tileset.tilewidth,
              h: tileset.tileheight
            },
            sourceSize: { w: tileset.tilewidth, h: tileset.tileheight },
            spriteSourceSize: {
              x: 0,
              y: 0,
              w: tileset.tilewidth,
              h: tileset.tileheight
            }
          }
        ];
      })
    ),
    meta: {
      image: tileset.image,
      size: { w: tileset.imagewidth, h: tileset.imageheight },
      scale: '1'
    }
  };

  const spritesheet = new PIXI.Spritesheet(texture, data);
  await spritesheet.parse();

  return spritesheet;
};

export const createStage = async (app: PIXI.Application, stage: Stage) => {
  const toIsometric = ({ x, y }: Point) =>
    mulVector(
      cartesianToIsometric({ x, y }),
      divVector({ x: stage.map.tilewidth, y: stage.map.tileheight }, 2)
    );
  const [ground] = stage.map.layers.filter(layer => layer.type === 'tilelayer');

  const sheet = await createTilesetSpriteSheet(stage);

  const colorMatrix = new PIXI.filters.ColorMatrixFilter();
  colorMatrix.contrast(1, false);

  const tiles = ground.data.map((tile, index) => {
    if (!tile) return;
    const mapOffset = { x: stage.tileset.tilewidth / 2, y: 100 };

    const sprite = new PIXI.Sprite(sheet.textures[`${stage.id}-${tile}`]);
    sprite.interactive = true;
    sprite
      .on('mouseenter', () => {
        sprite.filters = [colorMatrix];
      })
      .on('mouseleave', () => {
        sprite.filters = [];
      });

    const point = {
      x: index % stage.map.height,
      y: Math.floor(index / stage.map.height)
    };
    const isoPoint = addVector(toIsometric(point), mapOffset);
    sprite.x = isoPoint.x;
    sprite.y = isoPoint.y;
    sprite.width = stage.tileset.tilewidth;
    sprite.height = stage.tileset.tileheight;

    return sprite;
  });

  tiles.forEach(sprite => {
    if (sprite) app.stage.addChild(sprite);
  });
};
