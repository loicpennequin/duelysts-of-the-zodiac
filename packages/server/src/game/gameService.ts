import { User } from '@prisma/client';
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
