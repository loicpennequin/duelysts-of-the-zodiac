import type { SendPasswordResetEmailDto } from '@dotz/shared';
import type { HandlerArgs } from '../../types';
import { findUserByEmail, updateUserById } from '../userService';
import crypto from 'crypto';
import { mailerService } from '../../core/mailService';
import { lostPasswordTemplate } from '../../core/emailTemplates';

export const sendPasswordResetEmailHandler = async ({
  input
}: HandlerArgs<SendPasswordResetEmailDto>) => {
  const user = await findUserByEmail(input.email);
  if (!user || !user.username) return;
  const passwordResetToken = crypto.randomBytes(20).toString('hex');

  await updateUserById(user.id, {
    passwordResetToken
  });

  await mailerService.sendMail({
    to: user.email,
    template: lostPasswordTemplate({
      username: user.username,
      link: `http://localhost:3000/reset-password?token=${passwordResetToken}`
    })
  });

  return { success: true };
};
