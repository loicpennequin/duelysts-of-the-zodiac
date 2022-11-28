import { matchmakingService } from '@renderer/api/matchmaking';

export const useJoinRankedQueue = (options = {}) =>
  useMutation({
    mutationFn: matchmakingService.joinRankedQueue,
    ...options
  });

export const useLeaveRankedQueue = (options = {}) =>
  useMutation({
    mutationFn: matchmakingService.leaveRankedQueue,
    ...options
  });
