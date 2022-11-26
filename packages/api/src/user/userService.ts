import { db } from '../db';
import type { CreateUserDto } from '@dotz/shared';
import bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';

const SALT_ROUNDS = 10;

export const findAllUsers = async () => {
  return await db.user.findMany();
};

export const createUser = async ({ password, ...dto }: CreateUserDto) => {
  const exists = await db.user.count({ where: { email: dto.email } });

  if (!exists) {
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
