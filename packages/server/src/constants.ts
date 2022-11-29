import { Game } from '@prisma/client';

export const REFRESH_TOKEN_COOKIE = 'refresh_token';

export const EMPTY_RESPONSE = { success: true } as const;

export const SOCKET_ROOMS = {
  GAME: (game: Game) => `game:${game.id}`
};
