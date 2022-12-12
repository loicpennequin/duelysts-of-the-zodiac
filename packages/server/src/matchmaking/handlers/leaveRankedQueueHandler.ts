import { SUCCESS_RESPONSE } from '../../constants';
import type { HandlerArgs } from '../../types';
import { rankedQueue } from '../queues';

export const leaveRankedQueueHandler = ({ ctx }: HandlerArgs) => {
  rankedQueue.leave(ctx.session!);

  return Promise.resolve(SUCCESS_RESPONSE);
};
