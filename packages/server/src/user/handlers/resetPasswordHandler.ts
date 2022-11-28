import type { ResetPasswordDto } from '@dotz/shared';
import { TRPCError } from '@trpc/server';
import type { HandlerArgs } from '../../types';
import { findByPasswordResetToken, resetPassword } from '../userService';

export const resetPasswordHandler = async ({
  input
}: HandlerArgs<ResetPasswordDto>) => {
  const user = await findByPasswordResetToken(input.token);

  if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

  await resetPassword(user.id, input.password);

  return { success: true };
};
