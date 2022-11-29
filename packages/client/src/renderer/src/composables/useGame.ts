import { gameService } from '@renderer/api/game';
import { queryKeys } from '@renderer/utils/constants';

export const useGameSession = (id: string, options = {}) => {
  return useQuery({
    queryKey: queryKeys.GAME_SESSION(id),
    queryFn: () => gameService.getSession(id),
    ...options
  });
};
