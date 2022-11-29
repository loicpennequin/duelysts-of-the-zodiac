import { GetGameSessionDto, SurrenderGameDto } from '@dotz/shared';
import { procedure, router } from '../core/router';
import { wrapProcedure } from '../utils';
import { getGameSessionHandler } from './handlers/getGameSessionHandler';
import { getOngoingGameHandler } from './handlers/getOngoingGameHandler';
import { surrenderGameGandler } from './handlers/surrenderGameHandler';

export const gameRouter = router({
  getOngoingGame: procedure
    .meta({ needsAuth: true })
    .query(args => wrapProcedure(() => getOngoingGameHandler(args))),

  getGameSession: procedure
    .input(GetGameSessionDto)
    .meta({ needsAuth: true })
    .query(args => wrapProcedure(() => getGameSessionHandler(args))),

  surrender: procedure
    .input(SurrenderGameDto)
    .meta({ needsAuth: true })
    .mutation(args => wrapProcedure(() => surrenderGameGandler(args)))
});
