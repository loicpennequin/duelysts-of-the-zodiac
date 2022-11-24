import { type inferAsyncReturnType, initTRPC } from '@trpc/server';
import type http from 'http';

export const t = initTRPC.create();
export const apiRouter = t.router({
  hello: t.procedure.query(() => {
    return 'hello from trpc with nodemon update';
  })
});
// export type definition of API
export type ApiRouter = typeof apiRouter;

type CreateContextOptions = {
  req: http.IncomingMessage;
  res: http.ServerResponse;
};
export const createApiContext = ({ req, res }: CreateContextOptions) => ({
  req,
  res
});

export type Context = inferAsyncReturnType<typeof createApiContext>;
