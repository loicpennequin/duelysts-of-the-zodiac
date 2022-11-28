import { REFRESH_TOKEN_COOKIE } from '../../constants';
import { refreshJWT } from '../authService';
import type { HandlerArgs } from '../../types';
import { TRPCError } from '@trpc/server';
import { config } from '../../config';
import { logoutHandler } from './logoutHandler';

export const refreshTokenHandler = async ({ ctx, input }: HandlerArgs) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const refreshTokenCookie = ctx.req.cookies?.[REFRESH_TOKEN_COOKIE] as string;
  if (!refreshTokenCookie) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  try {
    const { accessToken, refreshToken } = await refreshJWT(refreshTokenCookie);

    ctx.res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      path: config.REFRESH_TOKEN.PATH,
      httpOnly: config.REFRESH_TOKEN.HTTPONLY,
      secure: config.REFRESH_TOKEN.SECURE,
      sameSite: config.REFRESH_TOKEN.SAMESITE,
      maxAge: Date.now() + config.REFRESH_TOKEN.EXPIRES_IN_SECONDS * 1000
    });

    return { accessToken };
  } catch (err) {
    await logoutHandler({ ctx, input });
    throw err;
  }
};
