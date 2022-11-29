import { SurrenderGameDto } from '@dotz/shared';
import { TRPCError } from '@trpc/server';
import { HandlerArgs } from '../../types';
import { gameMapper } from '../gameMapper';
import { endGame, findGameById } from '../gameService';

export const surrenderGameGandler = async ({
  ctx,
  input
}: HandlerArgs<SurrenderGameDto>) => {
  const game = await findGameById(input.id, { include: { gameUsers: true } });
  if (game.endedAt) throw new TRPCError({ code: 'BAD_REQUEST' });

  const winnerId = game.gameUsers.find(
    gameUser => gameUser.userId !== ctx.session!.id
  )!.userId;

  const updatedGame = await endGame(input.id, winnerId);

  return gameMapper.toGameSessionDto(updatedGame);
};
