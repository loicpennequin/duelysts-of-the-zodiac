import { UserDto } from '@dotz/shared';
import { userService } from '@renderer/api/user';
import { queryKeys } from '@renderer/utils/constants';

export const useUserOnboarding = (options = {}) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: userService.completeOnboarding,
    ...options,
    onSuccess(data) {
      qc.setQueryData(queryKeys.SESSION(), data);
    }
  });
};
