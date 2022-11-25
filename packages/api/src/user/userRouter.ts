import { procedure, router } from '../router';
import { CreateUserDto } from './dtos';

export const userRouter = router({
  create: procedure.input(CreateUserDto).mutation(({ ctx, input }) => {
    return ctx.container.resolve('createUserUController').execute(input);
  }),

  findAll: procedure.query(({ ctx }) => {
    return ctx.container.resolve('getAllUsersController').execute();
  })
});
