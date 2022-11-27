import { authService } from '@renderer/api/auth';
import { queryKeys } from '@renderer/utils/queryKeys';

export const useLogin = (options = {}) => {
  const { push } = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    ...options,
    onSuccess() {
      qc.refetchQueries({ queryKey: queryKeys.session() });
      push({ name: 'Home' });
    }
  });
};

export const useLogout = (options = {}) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    ...options,
    onSuccess() {
      qc.setQueryData(queryKeys.session(), null);
    }
  });
};

export const useRefreshJwt = (options = {}) =>
  useMutation({
    mutationFn: authService.refreshJwt,
    ...options
  });
