import { procedure, router } from '../router';
import { CreateUserDto, UserOnboardingDto } from '@dotz/shared';
import { createUserHandler } from './handlers/createUserHandler';
import { getAllUsersHandler } from './handlers/getAllUsersHandler';
import { userOnboardingHandler } from './handlers/userOnboardingHandler';

export const userRouter = router({
  create: procedure.input(CreateUserDto).mutation(args => {
    return createUserHandler(args);
  }),

  findAll: procedure.query(() => {
    return getAllUsersHandler();
  }),

  onboarding: procedure
    .input(UserOnboardingDto)
    .meta({ needsAuth: true })
    .mutation(arg => userOnboardingHandler(arg))
});
