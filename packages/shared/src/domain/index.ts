import type { User as PrismaUser } from '@prisma/client';

import z from 'zod';
import type { Override } from '../types';

export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 20;

export const CreateUserDto = z.object({
  email: z.string().email().trim(),
  password: z.string()
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;

export type UserDto = Override<
  PrismaUser,
  { passwordHash?: never; refreshToken?: never; passwordResetToken?: never }
>;

export const LoginDto = z.object({
  email: z.string().email().trim(),
  password: z.string()
});

export type LoginDto = z.infer<typeof LoginDto>;

export const UserOnboardingDto = z.object({
  username: z.string().trim().min(USERNAME_MIN_LENGTH).max(USERNAME_MAX_LENGTH)
});

export type UserOnboardingDto = z.infer<typeof UserOnboardingDto>;

export const SendPasswordResetEmailDto = z.object({
  email: z.string().email()
});
export type SendPasswordResetEmailDto = z.infer<
  typeof SendPasswordResetEmailDto
>;
