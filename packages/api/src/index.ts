import { type Context, createApiContext } from './createContext';
import { userRouter } from './user/userRouter';
import { router } from './router';

export const apiRouter = router({
  user: userRouter
});

export type ApiRouter = typeof apiRouter;

export { createApiContext, Context };
