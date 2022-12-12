import { SUCCESS_RESPONSE } from '../../constants';
import type { HandlerArgs } from '../../types';
import { rankedQueue } from '../queues';

export const joinRankedQueueHandler = ({ ctx }: HandlerArgs) => {
  rankedQueue.join(ctx.session!);

  return Promise.resolve(SUCCESS_RESPONSE);
};
