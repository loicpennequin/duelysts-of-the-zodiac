import { authService } from '@renderer/api/auth';

export const useSession = (options = {}) => {
  const opts = computed(() => ({
    queryKey: ['session'],
    queryFn: authService.getSession,
    ...unref(options)
  }));

  return useQuery(opts);
};
