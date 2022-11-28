import type { LoginDto } from '@dotz/shared';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config';
import {
  findUserById,
  findUserByEmail,
  updateUserById,
  findUserByRefreshToken
} from '../user/userService';

export const generateJWT = (userId: string) => {
  return jwt.sign({ sub: userId }, config.JWT.SECRET, {
    expiresIn: config.JWT.EXPIRES_IN_SECONDS
  });
};

export const generateRefreshToken = () => {
  return jwt.sign(
    { sub: crypto.randomBytes(10).toString('hex') },
    config.REFRESH_TOKEN.SECRET,
    {
      expiresIn: config.REFRESH_TOKEN.EXPIRES_IN_SECONDS
    }
  );
};

export const verifyJwt = (token: string) => {
  try {
    return jwt.verify(token, config.JWT.SECRET, {
      complete: false
    }) as jwt.JwtPayload;
  } catch {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, config.REFRESH_TOKEN.SECRET, {
      complete: false
    });
  } catch {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
};

export const updateUserRefreshToken = (userId: string, token: string) =>
  updateUserById(userId, {
    refreshToken: {
      upsert: {
        create: {
          value: token
        },
        update: {
          value: token
        }
      }
    }
  });

export const login = async (dto: LoginDto) => {
  const user = await findUserByEmail(dto.email);
  const isValid =
    user && (await bcrypt.compare(dto.password, user.passwordHash));
  if (!isValid) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const tokens = {
    accessToken: generateJWT(user.id),
    refreshToken: generateRefreshToken()
  };

  await updateUserRefreshToken(user.id, tokens.refreshToken);

  return tokens;
};

export const logout = (userId: string) => {
  return updateUserById(userId, { refreshToken: { delete: true } });
};

export const authenticate = async (token: string) => {
  const { sub } = verifyJwt(token);

  const user = await findUserById(sub as string);
  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return user;
};

export const refreshJWT = async (refreshToken: string) => {
  const user = await findUserByRefreshToken(refreshToken);
  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  verifyRefreshToken(refreshToken);

  const tokens = {
    accessToken: generateJWT(user.id),
    refreshToken: generateRefreshToken()
  };

  await updateUserRefreshToken(user.id, tokens.refreshToken);

  return tokens;
};
