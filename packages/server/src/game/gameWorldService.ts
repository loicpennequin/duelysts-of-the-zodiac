import { redisClient } from '../core/redis';
import { createWorld as createDotzWorld, GameWorld } from '@dotz/sdk';

const worlds = new Map<string, GameWorld>();

const serializeWorld = (world: GameWorld) => JSON.stringify(world);
const deserializeWorld = (json: string) => JSON.parse(json) as GameWorld;

export const getWorldById = async (id: string) => {
  if (!worlds.has(id)) {
    const cachedWorld = await redisClient.get(id);
    if (!cachedWorld) throw new Error(`Couldn't find world with id ${id}`);

    worlds.set(id, deserializeWorld(cachedWorld));
  }

  return worlds.get(id) as GameWorld;
};

export const updateWorldById = async (id: string, newWorld: GameWorld) => {
  worlds.set(id, newWorld);

  return await redisClient.set(id, serializeWorld(newWorld));
};

export const createWorld = async (id: string, playerIds: string[]) => {
  const world = createDotzWorld(playerIds);
  worlds.set(id, world);

  return await redisClient.set(id, serializeWorld(world));
};
