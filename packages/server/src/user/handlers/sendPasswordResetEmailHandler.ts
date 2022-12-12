import type { SendPasswordResetEmailDto } from '@dotz/shared';
import type { HandlerArgs } from '../../types';
import { findUserByEmail, updateUserById } from '../userService';
import crypto from 'crypto';
import { mailerService } from '../../core/mailService';
import { lostPasswordTemplate } from '../../core/emailTemplates';
import { config } from '../../config';
import { TRPCError } from '@trpc/server';
import { SUCCESS_RESPONSE } from '../../constants';

export const sendPasswordResetEmailHandler = async ({
  input
}: HandlerArgs<SendPasswordResetEmailDto>) => {
  const user = await findUserByEmail(input.email);
  if (!user || !user.username) throw new TRPCError({ code: 'NOT_FOUND' });
  const passwordResetToken = crypto.randomBytes(20).toString('hex');

  await updateUserById(user.id, {
    passwordResetToken: {
      upsert: {
        update: {
          value: passwordResetToken
        },
        create: {
          value: passwordResetToken
        }
      }
    }
  });

  await mailerService.sendMail({
    to: user.email,
    template: lostPasswordTemplate({
      username: user.username,
      link: `${config.WEBSITE_URL}/reset-password?token=${passwordResetToken}`
    })
  });

  return SUCCESS_RESPONSE;
};
