import type http from 'http';
import type { inferAsyncReturnType } from '@trpc/server';
import { asValue, asClass } from 'awilix';
import { createTypedContainer } from './createContainer';
import { UserRepository } from './user/UserRepository';
import { CreateUserController } from './user/controllers/CreateUserController';
import { GetAllUsersController } from './user/controllers/GetallUsersController';
import { db } from './db';
import { UserMapper } from './user/UserMapper';

export type CreateContextOptions = {
  req: http.IncomingMessage;
  res: http.ServerResponse;
};
export const createApiContext = ({ req, res }: CreateContextOptions) => ({
  req,
  res,
  container: createTypedContainer({
    db: asValue(db),
    userRepo: asClass(UserRepository),
    createUserUController: asClass(CreateUserController),
    userMapper: asClass(UserMapper),
    getAllUsersController: asClass(GetAllUsersController)
  })
});

export type Context = inferAsyncReturnType<typeof createApiContext>;
