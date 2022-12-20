import { GAME_ENDED, GAME_FOUND, Nullable } from '@dotz/shared';
import { Prisma } from '@prisma/client';
import { SOCKET_ROOMS } from '../constants';
import { db } from '../core/db';
import { getIo, getSocket } from '../core/io';
import { gameMapper } from './gameMapper';
import { createWorld } from './gameWorldService';

export const createGame = async <T extends Omit<Prisma.GameCreateArgs, 'data'>>(
  userIds: string[],
  options: T
) => {
  const game = await db.game.create({
    ...options,
    data: {
      gameUsers: {
        create: userIds.map(id => ({
          user: {
            connect: { id }
          }
        }))
      }
    }
  });
  createWorld(game.id, userIds);

  userIds.forEach(userId => {
    const socket = getSocket(userId)!;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    socket.join(SOCKET_ROOMS.GAME(game));
    socket.emit(GAME_FOUND, { gameId: game.id });
  });

  return game as Prisma.GameGetPayload<T>;
};

export const findGame = async <T extends Prisma.GameFindFirstArgs>(
  options: T
) => {
  const game = await db.game.findFirst(options);

  return game as Nullable<Prisma.GameGetPayload<T>>;
};

export const findGameById = async <
  T extends Omit<Prisma.GameFindUniqueArgs, 'where'>
>(
  id: string,
  options: T
) => {
  const game = await db.game.findUnique({
    where: { id },
    ...options
  });

  return game as Prisma.GameGetPayload<T>;
};

export const updateGameById = async <
  T extends Omit<Prisma.GameUpdateArgs, 'where' | 'data'>
>(
  id: string,
  data: Prisma.GameUpdateArgs['data'],
  options?: T
) => {
  const game = await db.game.update({
    ...options,
    where: { id },
    data
  });

  return game as Prisma.GameGetPayload<T>;
};

export const endGame = async (gameId: string, winnerId?: string) => {
  const updatedGame = await updateGameById(
    gameId,
    {
      gameUsers: winnerId
        ? {
            update: {
              where: {
                gameId_userId: {
                  gameId: gameId,
                  userId: winnerId
                }
              },
              data: { winner: true }
            }
          }
        : undefined,
      endedAt: new Date()
    },
    {
      include: { gameUsers: { include: { user: true } } }
    }
  );

  const room = getIo().in(SOCKET_ROOMS.GAME(updatedGame));
  room.emit(GAME_ENDED, {
    gameSession: gameMapper.toGameSessionDto(updatedGame)
  });
  room.socketsLeave(SOCKET_ROOMS.GAME(updatedGame));
  return updatedGame;
};
