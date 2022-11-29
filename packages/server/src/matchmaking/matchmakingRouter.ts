import { procedure, router } from '../core/router';
import { wrapProcedure } from '../utils';
import { joinRankedQueueHandler } from './handlers/joinRankedQueueHandler';
import { leaveRankedQueueHandler } from './handlers/leaveRankedQueueHandler';

export const matchmakingRouter = router({
  joinRankedQueue: procedure
    .meta({ needsAuth: true })
    .mutation(args => wrapProcedure(() => joinRankedQueueHandler(args))),

  leaveRankedQueue: procedure
    .meta({ needsAuth: true })
    .mutation(args => wrapProcedure(() => leaveRankedQueueHandler(args)))
});
