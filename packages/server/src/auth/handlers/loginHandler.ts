import type { LoginDto } from '@dotz/shared';
import { config } from '../../config';
import { REFRESH_TOKEN_COOKIE } from '../../constants';
import { login } from '../authService';
import type { HandlerArgs } from '../../types';

export const loginHandler = async ({ ctx, input }: HandlerArgs<LoginDto>) => {
  const { accessToken, refreshToken } = await login(input);

  ctx.res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    path: config.REFRESH_TOKEN.PATH,
    httpOnly: config.REFRESH_TOKEN.HTTPONLY,
    secure: config.REFRESH_TOKEN.SECURE,
    sameSite: config.REFRESH_TOKEN.SAMESITE,
    maxAge: Date.now() + config.REFRESH_TOKEN.EXPIRES_IN_SECONDS * 1000
  });

  return { accessToken };
};
