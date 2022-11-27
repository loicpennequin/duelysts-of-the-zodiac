import { type Context, createApiContext } from './createContext';
import { userRouter } from './user/userRouter';
import { router } from './router';
import { authRouter } from './auth/authRouter';

export const apiRouter = router({
  user: userRouter,
  auth: authRouter
});

export type ApiRouter = typeof apiRouter;

export { createApiContext, Context };
export type { ApiConfig } from './types';
