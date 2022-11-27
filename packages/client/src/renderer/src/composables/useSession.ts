import { authService } from '@renderer/api/auth';
import { queryKeys } from '@renderer/utils/queryKeys';
import { useQuery } from '@tanstack/vue-query';

export const useSession = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.session(),
    queryFn: authService.getSession,
    ...options
  });
};
