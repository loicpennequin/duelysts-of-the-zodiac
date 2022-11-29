import { Prisma, User } from '@prisma/client';
import { db } from '../core/db';

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
