import type { HandlerArgs } from '../../types';
import { userMapper } from '../../user/userMapper';

export const sessionHandler = ({ ctx }: HandlerArgs) => {
  return userMapper.toDto(ctx.session!);
};
