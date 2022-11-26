import { loginDto } from '@dotz/shared';
import { procedure, router } from '../router';
import { loginHandler } from './handlers/loginHandler';

export const userRouter = router({
  login: procedure.input(loginDto).mutation(({ input, ctx }) => {
    return loginHandler({ dto: input, res: ctx.res });
  })
});
