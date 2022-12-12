import { HandlerArgs } from '../../types';
import { gameMapper } from '../gameMapper';
import { findGame } from '../gameService';
import { getWorldById } from '../gameWorldService';

export const getOngoingGameHandler = async ({ ctx }: HandlerArgs) => {
  const game = await findGame({
    where: {
      endedAt: null,
      gameUsers: {
        some: {
          userId: ctx.session!.id
        }
      }
    },
    include: { gameUsers: { include: { user: true } } }
  });

  if (!game) return null;

  return gameMapper.toGameSessionDto(game);
};
