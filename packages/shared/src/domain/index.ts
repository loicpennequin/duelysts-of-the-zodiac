import type { User as PrismaUser } from '@prisma/client';

import z from 'zod';
import type { Override } from '../types';

export const CreateUserDto = z.object({
  email: z.string().email().trim(),
  password: z.string()
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;

export type UserDto = Override<PrismaUser, { passwordHash?: never }>;

export const LoginDto = z.object({
  email: z.string().email().trim(),
  password: z.string()
});

export type LoginDto = z.infer<typeof LoginDto>;
