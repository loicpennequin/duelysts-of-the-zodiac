import type { UserOnboardingDto } from '@dotz/shared';
import type { HandlerArgs } from '../../types';
import { userMapper } from '../userMapper';
import { updateUserById } from '../userService';

export const userOnboardingHandler = async ({
  input,
  ctx
}: HandlerArgs<UserOnboardingDto>) => {
  const user = await updateUserById(ctx.session!.id, input);

  return userMapper.toDto(user);
};
