import type { inferAsyncReturnType } from '@trpc/server';
import type { Request, Response } from 'express';
import { authenticate } from './auth/authService';

const parseAuthHeader = (header: string) => header.replace('Bearer ', '');

export type CreateContextOptions = {
  req: Request;
  res: Response;
};
export const createApiContext = async (ctx: CreateContextOptions) => {
  const authHeader = ctx.req.headers.authorization;

  return {
    req: ctx.req,
    res: ctx.res,
    session: authHeader ? await authenticate(parseAuthHeader(authHeader)) : null
  };
};

export type Context = inferAsyncReturnType<typeof createApiContext>;
