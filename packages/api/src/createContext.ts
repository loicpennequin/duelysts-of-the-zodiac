import type http from 'http';
import type { inferAsyncReturnType } from '@trpc/server';
import { db } from '@dotz/db';
import { asValue, asClass } from 'awilix';
import { createTypedContainer } from './createContainer';
import { UserRepository } from './user/UserRepository';
import { CreateUserController } from './user/controllers/CreateUserController';
import { GetAllUsersController } from './user/controllers/GetallUsersController';

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
    getAllUsersController: asClass(GetAllUsersController)
  })
});

export type Context = inferAsyncReturnType<typeof createApiContext>;
