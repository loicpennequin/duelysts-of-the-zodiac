import { GetGameSessionDto } from '@dotz/shared';
import { TRPCError } from '@trpc/server';
import { HandlerArgs } from '../../types';
import { gameMapper } from '../gameMapper';
import { findGameById } from '../gameService';

export const getGameSessionHandler = async ({
  ctx,
  input
}: HandlerArgs<GetGameSessionDto>) => {
  const game = await findGameById(input.id, {
    include: {
      gameUsers: { include: { user: true } }
    }
  });

  if (!game) throw new TRPCError({ code: 'NOT_FOUND' });
  const isAuthorized = game.gameUsers.some(
    gameUser => gameUser.userId === ctx.session!.id
  );

  if (!isAuthorized) throw new TRPCError({ code: 'FORBIDDEN' });

  return gameMapper.toGameSessionDto(game);
};
