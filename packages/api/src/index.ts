import { type inferAsyncReturnType, initTRPC } from '@trpc/server';
import type http from 'http';
import { prisma } from '@dotz/db';

export const t = initTRPC.context<Context>().create();
export const apiRouter = t.router({
  hello: t.procedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  })
});

export type ApiRouter = typeof apiRouter;

type CreateContextOptions = {
  req: http.IncomingMessage;
  res: http.ServerResponse;
};
export const createApiContext = ({ req, res }: CreateContextOptions) => ({
  req,
  res,
  db: prisma
});

export type Context = inferAsyncReturnType<typeof createApiContext>;
