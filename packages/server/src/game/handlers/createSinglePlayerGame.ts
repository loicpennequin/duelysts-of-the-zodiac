import { HandlerArgs } from '../../types';
import { gameMapper } from '../gameMapper';
import { createGame } from '../gameService';

export const createSinglePlayerGame = async ({ ctx }: HandlerArgs) => {
  const game = await createGame([ctx.session!.id], {
    include: {
      gameUsers: { include: { user: true } }
    }
  });

  return gameMapper.toGameSessionDto(game);
};
