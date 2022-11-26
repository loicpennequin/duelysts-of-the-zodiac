import { REFRESH_TOKEN_COOKIE } from '../../constants';
import { logout } from '../authService';
import type { HandlerArgs } from '../../types';

export const logoutHandler = async ({ ctx }: HandlerArgs) => {
  if (!ctx.session) return true;
  await logout(ctx.session.id);
  ctx.res.clearCookie(REFRESH_TOKEN_COOKIE);

  return true;
};
