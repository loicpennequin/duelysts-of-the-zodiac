import { procedure, router } from '../router';
import { CreateUserDto } from '@dotz/shared';
import { createUserHandler } from './handlers/createUserHandler';
import { getAllUsersHandler } from './handlers/getAllUsersHandler';

export const userRouter = router({
  create: procedure.input(CreateUserDto).mutation(args => {
    return createUserHandler(args);
  }),

  findAll: procedure.query(() => {
    return getAllUsersHandler();
  })
});
