import { gameService } from '@renderer/api/game';
import { queryKeys } from '@renderer/utils/constants';

export const useGameSession = (id: string, options = {}) => {
  return useQuery({
    queryKey: queryKeys.GAME_SESSION(id),
    queryFn: () => gameService.getSession(id),
    ...options
  });
};

export const useSurrender = (options = {}) =>
  useMutation({
    mutationFn: gameService.surrender,
    ...options
  });

export const useOngoingGame = (options = {}) =>
  useQuery({
    queryKey: queryKeys.ONGOING_GAME(),
    queryFn: () => gameService.getOngoingGame(),
    staleTime: 0,
    ...options
  });
