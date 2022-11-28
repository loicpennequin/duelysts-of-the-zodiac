import type { HandlerArgs } from '../../types';
import { rankedQueue } from '../queues';

export const joinRankedQueueHandler = ({ ctx }: HandlerArgs) => {
  rankedQueue.join(ctx.session!);

  return Promise.resolve({ success: true });
};
