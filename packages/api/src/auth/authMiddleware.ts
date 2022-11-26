import { TRPCError } from '@trpc/server';
import { middleware } from '../router';

export const authMiddleware = middleware(({ meta, next, ctx }) => {
  if (meta?.needsAuth && !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next();
});
