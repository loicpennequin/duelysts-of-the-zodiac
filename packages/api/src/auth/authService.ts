import type { LoginDto } from '@dotz/shared';
import { TRPCError } from '@trpc/server';
import { db } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getConfig } from '../config';

export const generateJWT = (userId: string) => {
  const config = getConfig();

  return jwt.sign({ sub: userId }, config.JWT.SECRET, {
    expiresIn: config.JWT.EXPIRES_IN_SECONDS
  });
};

export const generateRefreshToken = () => {
  const config = getConfig();

  return jwt.sign(
    { sub: crypto.randomBytes(20).toString('hex') },
    config.REFRESH_TOKEN.SECRET,
    {
      expiresIn: config.REFRESH_TOKEN.EXPIRES_IN_SECONDS
    }
  );
};

export const login = async (dto: LoginDto) => {
  const user = await db.user.findUnique({ where: { email: dto.email } });

  const isValid =
    user && (await bcrypt.compare(dto.password, user.passwordHash));

  if (!isValid) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const tokens = {
    accessToken: generateJWT(user.id),
    refreshToken: generateRefreshToken()
  };

  await db.user.update({
    where: { email: dto.email },
    data: { refreshToken: tokens.refreshToken }
  });

  return tokens;
};
