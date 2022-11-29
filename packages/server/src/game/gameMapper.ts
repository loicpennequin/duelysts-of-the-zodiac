import type { GameSessionDto } from '@dotz/shared';
import { GameSession } from '../types';
import { userMapper } from '../user/userMapper';

export const gameMapper = {
  toGameSessionDto(gameSession: GameSession): GameSessionDto {
    const { gameUsers, ...rest } = gameSession;

    return {
      ...rest,
      users: gameUsers.map(gameUser => userMapper.toDto(gameUser.user)),
      winnerId: gameUsers.find(gameUser => gameUser.winner)?.userId
    };
  }
};
