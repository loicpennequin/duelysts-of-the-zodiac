import { procedure, router } from '../router';
import {
  CreateUserDto,
  SendPasswordResetEmailDto,
  UserOnboardingDto
} from '@dotz/shared';
import { createUserHandler } from './handlers/createUserHandler';
import { userOnboardingHandler } from './handlers/userOnboardingHandler';
import { wrapProcedure } from '../utils';
import { sendPasswordResetEmailHandler } from './handlers/sendPasswordResetEmailHandler';

export const userRouter = router({
  create: procedure
    .input(CreateUserDto)
    .mutation(args => wrapProcedure(() => createUserHandler(args))),

  onboarding: procedure
    .input(UserOnboardingDto)
    .meta({ needsAuth: true })
    .mutation(arg => wrapProcedure(() => userOnboardingHandler(arg))),

  sendResetPasswordEmail: procedure
    .input(SendPasswordResetEmailDto)
    .mutation(args => wrapProcedure(() => sendPasswordResetEmailHandler(args)))
});
