import { LoginDto } from '@dotz/shared';
import { procedure, router } from '../router';
import { wrapProcedure } from '../utils';
import { loginHandler } from './handlers/loginHandler';
import { logoutHandler } from './handlers/logoutHandler';
import { refreshTokenHandler } from './handlers/refreshTokenHandler';
import { sessionHandler } from './handlers/sessionHandler';

export const authRouter = router({
  login: procedure
    .input(LoginDto)
    .mutation(args => wrapProcedure(() => loginHandler(args))),

  logout: procedure.mutation(args => wrapProcedure(() => logoutHandler(args))),

  refreshToken: procedure.mutation(args =>
    wrapProcedure(() => refreshTokenHandler(args))
  ),

  session: procedure
    .meta({ needsAuth: true })
    .query(args => wrapProcedure(() => sessionHandler(args)))
});
