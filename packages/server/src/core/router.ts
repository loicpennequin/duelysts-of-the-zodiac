import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './createContext';
import superjson from 'superjson';
import type { RouterMeta } from '../types';
import chalk from 'chalk';

export const logger = (...messages: string[]) =>
  console.log(chalk.blue('[ TRPC ]'), ' - ', ...messages);

export const t = initTRPC.context<Context>().meta<RouterMeta>().create({
  transformer: superjson
});

const loggerMiddleware = t.middleware(async ({ path, next }) => {
  logger(`${path}`);

  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  logger(`${path} - END : ${durationMs}ms`);

  return result;
});

const authMiddleware = t.middleware(({ ctx, meta, next }) => {
  if (meta?.needsAuth && !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next();
});

export const middleware = t.middleware;
export const router = t.router;
export const procedure = t.procedure.use(loggerMiddleware).use(authMiddleware);
