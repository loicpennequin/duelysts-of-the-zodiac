import type { inferAsyncReturnType } from '@trpc/server';
import type { Request, Response } from 'express';
import { setConfig } from './config';
import type { ApiConfig } from './types';

export type CreateContextOptions = {
  req: Request;
  res: Response;
  config: ApiConfig;
};
export const createApiContext = (ctx: CreateContextOptions) => {
  setConfig(ctx.config);

  return {
    req: ctx.req,
    res: ctx.req
  };
};

export type Context = inferAsyncReturnType<typeof createApiContext>;
