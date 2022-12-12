import { Stage } from '@dotz/sdk';
import * as PIXI from 'pixi.js';

const loadedTextures = new Map<string, Promise<PIXI.Texture>>();

export const createTilesetSpriteSheet = async (stage: Stage) => {
  const { tileset } = stage;

  const path = `/tilesets/${tileset.image}`;
  if (!loadedTextures.has(path)) {
    loadedTextures.set(path, PIXI.Assets.load(path) as Promise<PIXI.Texture>);
  }

  const texture = (await loadedTextures.get(path)) as PIXI.Texture;

  const data = {
    frames: Object.fromEntries(
      Array.from({ length: tileset.tilecount }, (_, index) => {
        const path = `${stage.id}-${index + 1}`;
        // avoids console warnings with HMR
        if (import.meta.env.DEV) {
          PIXI.Texture.removeFromCache(path);
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
