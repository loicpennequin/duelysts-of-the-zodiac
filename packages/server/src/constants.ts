import { isString } from '@dotz/shared';
import { Game } from '@prisma/client';
import { GameId } from './types';

export const REFRESH_TOKEN_COOKIE = 'refresh_token';

export const SUCCESS_RESPONSE = { success: true } as const;

export const SOCKET_ROOMS = {
  GAME: (game: Game | GameId) => `game:${isString(game) ? game : game.id}`
};
