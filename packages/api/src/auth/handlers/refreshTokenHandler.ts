import { REFRESH_TOKEN_COOKIE } from '../../constants';
import { refreshJWT } from '../authService';
import type { HandlerArgs } from '../../types';
import { TRPCError } from '@trpc/server';
import { getConfig } from '../../config';

export const refreshTokenHandler = async ({ ctx }: HandlerArgs) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const refreshTokenCookie = ctx.req.cookies?.[REFRESH_TOKEN_COOKIE] as string;
  if (!refreshTokenCookie) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const config = getConfig();

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
    ctx.res.clearCookie(REFRESH_TOKEN_COOKIE);
    throw err;
  }
};
