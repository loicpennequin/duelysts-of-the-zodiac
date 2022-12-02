import { Stage } from '@dotz/sdk';
import { rotateMatrix } from '@dotz/shared';
import {
  type Point,
  mulVector,
  cartesianToIsometric,
  divVector,
  addVector,
  createMatrix
} from '@dotz/shared';
import {
  createSpritesheetFrameObject,
  parseAsperiteAnimationSheet
} from '@renderer/utils/canvas';
import * as PIXI from 'pixi.js';
import { Camera } from './createCamera';
// @ts-ignore bruh
import seiyaJSON from './seiya.json';

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

const rotateLayer = (
  containers: PIXI.Container[],
  stage: Stage,
  angle: number
) => {
  const matrix = createMatrix(
    { h: stage.map.width, w: stage.map.height },
    ({ x, y }) => {
      const index = y * stage.map.height + x;
      const container = containers[index];

      return container;
    }
  );

  return rotateMatrix<PIXI.Container>(matrix, angle);
};

const toIsometric = ({ x, y }: Point, stage: Stage) =>
  mulVector(
    cartesianToIsometric({ x, y }),
    divVector({ x: stage.map.tilewidth, y: stage.map.tileheight }, 2)
  );

const getTileIsoPoint = (stage: Stage, index: number) => {
  const mapOffset = { x: stage.tileset.tilewidth / 2, y: 0 };

  const point = {
    x: index % stage.map.height,
    y: Math.floor(index / stage.map.height)
  };
  return addVector(toIsometric(point, stage), mapOffset);
};

export const createStage = async (
  app: PIXI.Application,
  stage: Stage,
  camera: Camera
) => {
  const [ground] = stage.map.layers.filter(layer => layer.type === 'tilelayer');

  const sheet = await createTilesetSpriteSheet(stage);

  const colorMatrix = new PIXI.filters.ColorMatrixFilter();
  colorMatrix.contrast(1, false);

  const tiles = ground.data.map((tile, index) => {
    const container = new PIXI.Container();
    const isoPoint = getTileIsoPoint(stage, index);
    container.position.set(isoPoint.x, isoPoint.y);

    if (tile) {
      container.interactive = true;
      container
        .on('mouseenter', () => {
          container.filters = [colorMatrix];
        })
        .on('mouseleave', () => {
          container.filters = [];
        });
      const sprite = new PIXI.Sprite(sheet.textures[`${stage.id}-${tile}`]);
      sprite.width = stage.tileset.tilewidth;
      sprite.height = stage.tileset.tileheight;
      container.addChild(sprite);
    }

    return container;
  });

  const seiyaTexture = await PIXI.Assets.load('/units/seiya.png');

  const addUnit = async (sprite: PIXI.Container) => {
    const data = parseAsperiteAnimationSheet(seiyaJSON);
    const seiyaSpritesheet = new PIXI.Spritesheet(seiyaTexture, data);
    await seiyaSpritesheet.parse();
    const seiya = new PIXI.AnimatedSprite(
      createSpritesheetFrameObject('idle', seiyaSpritesheet, data)
    );
    // seiya.position.y = seiya.position.y + seiya.width / 4;
    seiya.position.x = seiya.position.x - seiya.width / 4;
    seiya.position.y = seiya.position.y - seiya.height / 2;
    seiya.play();
    sprite.addChild(seiya);
  };

  tiles.forEach((container, index) => {
    if (!container) return;
    app.stage.addChild(container);
    if (index === 0) {
      addUnit(container);
    }
  });

  // @TODO fix this crap by having the camera emit events instead
  let prevAngle = camera.view.angle;
  app.ticker.add(() => {
    if (camera.view.angle === prevAngle) return;
    prevAngle = camera.view.angle;

    rotateLayer(tiles, stage, camera.view.angle)
      .flat()
      .forEach((container, index) => {
        const isoPoint = getTileIsoPoint(stage, index);
        container.position.set(isoPoint.x, isoPoint.y);
        container.zIndex = index;
      });

    app.stage.sortChildren();
  });
};
