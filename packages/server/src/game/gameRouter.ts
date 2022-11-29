import { GetGameSessionDto } from '@dotz/shared';
import { procedure, router } from '../core/router';
import { wrapProcedure } from '../utils';
import { getGameSessionHandler } from './handlers/getGameSessionHandler';

export const gameRouter = router({
  getGameSession: procedure
    .input(GetGameSessionDto)
    .meta({ needsAuth: true })
    .query(args => wrapProcedure(() => getGameSessionHandler(args)))
});
