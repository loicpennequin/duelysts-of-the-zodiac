import { GAME_ENDED, Nullable } from '@dotz/shared';
import { Prisma, User } from '@prisma/client';
import { SOCKET_ROOMS } from '../constants';
import { db } from '../core/db';
import { getIo } from '../core/io';
import { gameMapper } from './gameMapper';

export const createGame = (users: [User, User]) => {
  return db.game.create({
    data: {
      gameUsers: {
        create: users.map(user => ({
          user: {
            connect: {
              id: user.id
            }
          }
        }))
      }
    }
  });
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

export const endGame = async (gameId: string, winnerId: string) => {
  const updatedGame = await updateGameById(
    gameId,
    {
      gameUsers: {
        update: {
          where: {
            gameId_userId: {
              gameId: gameId,
              userId: winnerId
            }
          },
          data: { winner: true }
        }
      },
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
