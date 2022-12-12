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
  if (!game) throw new TRPCError({ code: 'NOT_FOUND' });
  if (game.endedAt) throw new TRPCError({ code: 'BAD_REQUEST' });

  const winner = game.gameUsers.find(
    gameUser => gameUser.userId !== ctx.session!.id
  );

  const updatedGame = await endGame(input.id, winner?.userId);

  return gameMapper.toGameSessionDto(updatedGame);
};
