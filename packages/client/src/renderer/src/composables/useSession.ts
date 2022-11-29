import { UserDto } from '@dotz/shared';
import { authService } from '@renderer/api/auth';
import { queryKeys } from '@renderer/utils/constants';
import { useQuery } from '@tanstack/vue-query';

export const useSession = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.SESSION(),
    queryFn: authService.getSession as () => Promise<UserDto>,
    ...options
  });
};
