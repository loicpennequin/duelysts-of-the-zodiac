import { type GameWorldDto, randomInt } from '@dotz/shared';
import { createMap } from './createMap';

export type GameWorld = GameWorldDto;

const CELL_SIZE = 32;
export const createWorld = (playerIds: string[]): GameWorld => {
  const map = createMap();
  return {
    map,
    players: playerIds.map(id => ({
      id,
      position: {
        x: randomInt(map.width * CELL_SIZE),
        y: randomInt(map.height * CELL_SIZE)
      },
      color: 0xff0000
    }))
  };
};
