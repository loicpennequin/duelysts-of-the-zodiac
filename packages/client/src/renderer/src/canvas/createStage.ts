import { Stage } from '@dotz/sdk';
import {
  type Point,
  mulVector,
  cartesianToIsometric,
  divVector,
  addVector
} from '@dotz/shared';
import * as PIXI from 'pixi.js';

export const createStage = async (app: PIXI.Application, stage: Stage) => {
  // const getTileCoords = (index: number): Rectangle => {
  //   return {
  //     x: ((index - 1) % stage.tileset.columns) * stage.tileset.tilewidth,
  //     y: Math.floor(index / stage.tileset.columns) * stage.tileset.tileheight,
  //     w: stage.tileset.tilewidth,
  //     h: stage.tileset.tileheight
  //   };
  // };

  const toIsometric = ({ x, y }: Point) =>
    mulVector(
      cartesianToIsometric({ x, y }),
      divVector({ x: stage.map.tilewidth, y: stage.map.tileheight }, 2)
    );
  const [ground] = stage.map.layers.filter(layer => layer.type === 'tilelayer');

  ground.data.forEach((tile, index) => {
    if (!tile) return;
    const mapOffset = { x: stage.tileset.tilewidth / 2, y: 100 };

    // const tileCoords = getTileCoords(tile);
    const sprite = PIXI.Sprite.from(`/tilesets/${stage.tileset.image}`);
    const point = {
      x: index % stage.map.height,
      y: Math.floor(index / stage.map.height)
    };
    const isoPoint = addVector(toIsometric(point), mapOffset);
    sprite.x = isoPoint.x;
    sprite.y = isoPoint.y;
    sprite.width = stage.tileset.tilewidth;
    sprite.height = stage.tileset.tileheight;
    console.log(sprite.width, sprite.height);
    app.stage.addChild(sprite);
  });
};
