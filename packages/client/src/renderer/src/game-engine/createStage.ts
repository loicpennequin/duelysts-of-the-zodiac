import { Stage, units } from '@dotz/sdk';
import { Nullable, rotateMatrix } from '@dotz/shared';
import {
  type Point,
  mulVector,
  cartesianToIsometric,
  divVector,
  addVector,
  createMatrix
} from '@dotz/shared';
import * as PIXI from 'pixi.js';
import { Camera } from './createCamera';
import { createStageUnit } from './createStageUnit';
import { createTilesetSpriteSheet } from './creatTilesetSpritesheet';
// @ts-ignore bruh

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
  const selectedTileFilter = new PIXI.filters.ColorMatrixFilter();
  selectedTileFilter.contrast(0.75, false);

  const seiya = await createStageUnit(units.seiya);

  const tiles = ground.data.map((tile, index) => {
    const container = new PIXI.Container();
    const isoPoint = getTileIsoPoint(stage, index);
    container.position.set(isoPoint.x, isoPoint.y);

    if (tile) {
      const sprite = new PIXI.Sprite(sheet.textures[`${stage.id}-${tile}`]);
      sprite.width = stage.tileset.tilewidth;
      sprite.height = stage.tileset.tileheight;
      container.interactive = true;
      container.filters = [];

      container
        .on('mouseenter', () => {
          if (!container.filters?.includes(colorMatrix))
            container.filters?.push(colorMatrix);
        })
        .on('mouseleave', () => {
          container.filters =
            container.filters?.filter(filter => filter !== colorMatrix) ?? null;
        })
        .on('click', () => {
          seiya.parent?.removeChild(seiya);
          container.addChild(seiya);
        });

      container.addChild(sprite);
    }

    return container;
  });

  tiles.forEach((container, index) => {
    if (!container) return;
    if (!ground.data[index]) return;

    app.stage.addChild(container);
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
