import { GAME_ENDED, GAME_WORLD_UPDATE, GameSessionDto } from '@dotz/shared';
import { getIo, getSocket } from '../core/io';
import { redisClient } from '../core/redis';
import { createWorld as createDotzWorld, GameWorld, Player } from '@dotz/sdk';
import { SOCKET_ROOMS } from '../constants';
import { gameMapper } from './gameMapper';
import { Game } from '@prisma/client';

const worlds = new Map<string, GameWorld>();

const serializeWorld = (world: GameWorld) => JSON.stringify(world);
const deserializeWorld = (json: string) => JSON.parse(json) as GameWorld;

export const getWorldById = (id: string) => {
  if (!worlds.has(id)) {
    throw new Error(`Couldn't find world with id ${id}`);
    // const cachedWorld = await redisClient.get(id);
    // if (!cachedWorld) throw new Error(`Couldn't find world with id ${id}`);

    // worlds.set(id, deserializeWorld(cachedWorld));
  }

  return worlds.get(id) as GameWorld;
};

export const updateWorldById = (id: string, newWorld: GameWorld) => {
  worlds.set(id, newWorld);

  // return await redisClient.set(id, serializeWorld(newWorld));
};

export const createWorld = (id: string, playerIds: string[]) => {
  const world = createDotzWorld(playerIds, (world: GameWorld) => {
    const room = getIo().in(SOCKET_ROOMS.GAME(id));

    room.emit(GAME_WORLD_UPDATE, { players: world.players });
  });
  worlds.set(id, world);

  return world;
  // return await redisClient.set(id, serializeWorld(world));
};
export const destroyGameById = (game: GameSessionDto) => {
  const room = getIo().in(SOCKET_ROOMS.GAME(game));
  room.emit(GAME_ENDED, {
    gameSession: game
  });
  room.socketsLeave(SOCKET_ROOMS.GAME(game));
  const world = getWorldById(game.id);
  world.destroy();
};
