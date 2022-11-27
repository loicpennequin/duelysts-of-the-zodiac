import { FIFTEEN_MINUTES_IN_SECONDS, ONE_WEEK_IN_SECONDS } from '@dotz/shared';

export const createConfig = () => ({
  PORT: process.env.PORT,

  CORS: {
    ALLOWED_ORIGINS: ['http://localhost:3000', 'http://localhost:5173']
  },

  SESSION: {
    SECRET: process.env.SESSION_SECRET
  },

  REFRESH_TOKEN: {
    SECRET: process.env.REFRESH_TOKEN_SECRET,
    EXPIRES_IN_SECONDS: ONE_WEEK_IN_SECONDS,
    PATH: '/',
    HTTPONLY: true,
    SECURE: process.env.NODE_ENV === 'production',
    SAMESITE: 'lax'
  },

  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN_SECONDS: FIFTEEN_MINUTES_IN_SECONDS
  }
});