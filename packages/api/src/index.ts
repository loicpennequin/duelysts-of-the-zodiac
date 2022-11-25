import { initTRPC } from '@trpc/server';
import { type Context, createApiContext } from './createContext';
import { userRouter } from './user/userRouter';

export const t = initTRPC.context<Context>().create();
export const apiRouter = t.router({
  user: userRouter
});

export type ApiRouter = typeof apiRouter;

export { createApiContext, Context };
