import { trpcClient } from '@renderer/trpc';

export const matchmakingService = {
  joinRankedQueue() {
    return trpcClient.matchmaking.joinRankedQueue.mutate();
  },
  leaveRankedQueue() {
    return trpcClient.matchmaking.leaveRankedQueue.mutate();
  }
};
