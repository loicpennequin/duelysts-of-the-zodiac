import { TRPCError } from '@trpc/server';

export const wrapProcedure = async <T>(cb: () => Promise<T>) => {
  try {
    return await cb();
  } catch (err) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (err as Error).message
    });
  }
};
