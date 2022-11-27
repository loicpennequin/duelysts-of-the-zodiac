import { UserDto } from '@dotz/shared';
import { userService } from '@renderer/api/user';
import { queryKeys } from '@renderer/utils/queryKeys';

export const useUserOnboarding = (options = {}) => {
  const qc = useQueryClient();

  const queryOptions = computed(() => ({
    mutationFn: userService.completeOnboarding,
    onSuccess(data: UserDto) {
      qc.setQueryData(queryKeys.session(), data);
    },
    ...unref(options)
  }));

  return useMutation(queryOptions);
};
