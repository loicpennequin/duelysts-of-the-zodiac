import { db } from '../db';
import type { CreateUserDto } from '@dotz/shared';
import bcrypt from 'bcrypt';
import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

const SALT_ROUNDS = 10;

export const findAllUsers = async () => {
  return await db.user.findMany();
};

export const createUser = async ({ password, ...dto }: CreateUserDto) => {
  const exists = await db.user.count({ where: { email: dto.email } });

  if (exists) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'An account with this email already exists'
    });
  }

  return db.user.create({
    data: {
      ...dto,
      passwordHash: await bcrypt.hash(password, SALT_ROUNDS)
    }
  });
};

export const findUserByRefreshToken = (token: string) => {
  return db.refreshToken.findUnique({ where: { value: token } }).user();
};

export const findUserById = (id: string) => {
  return db.user.findUnique({ where: { id } });
};

export const findUserByEmail = (email: string) => {
  return db.user.findUnique({ where: { email } });
};

export const findByPasswordResetToken = (token: string) => {
  return db.passwordResetToken.findUnique({ where: { value: token } }).user();
};

export const updateUserById = (
  id: string,
  data: Prisma.UserUpdateArgs['data']
) => {
  return db.user.update({ where: { id }, data });
};

export const resetPassword = async (id: string, password: string) => {
  return db.user.update({
    where: { id },
    data: {
      passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
      passwordResetToken: { delete: true }
    }
  });
};
