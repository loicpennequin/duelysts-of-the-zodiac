import type http from 'http';
import type { inferAsyncReturnType } from '@trpc/server';

export type CreateContextOptions = {
  req: http.IncomingMessage;
  res: http.ServerResponse;
};
export const createApiContext = ({ req, res }: CreateContextOptions) => ({
  req,
  res
});

export type Context = inferAsyncReturnType<typeof createApiContext>;
