import { LoginDto } from '@dotz/shared';
import { procedure, router } from '../router';
import { loginHandler } from './handlers/loginHandler';
import { logoutHandler } from './handlers/logoutHandler';
import { refreshTokenHandler } from './handlers/refreshTokenHandler';

export const userRouter = router({
  login: procedure.input(LoginDto).mutation(args => loginHandler(args)),

  logout: procedure.mutation(args => logoutHandler(args)),

  refreshToken: procedure.mutation(args => refreshTokenHandler(args))
});
