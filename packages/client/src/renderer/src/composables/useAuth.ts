import { authService } from '@renderer/api/auth';
import { queryKeys } from '@renderer/utils/constants';
import { useSocket } from './useSocket';

export const useLogin = (options = {}) => {
  const { push } = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    ...options,
    onSuccess() {
      qc.refetchQueries({ queryKey: queryKeys.SESSION() });
      push({ name: 'Home' });
    }
  });
};

export const useLogout = (options = {}) => {
  const qc = useQueryClient();
  const socket = useSocket();

  return useMutation({
    mutationFn: authService.logout,
    ...options,
    onSuccess() {
      qc.setQueryData(queryKeys.SESSION(), null);
      socket.disconnect();
    }
  });
};

export const useRefreshJwt = (options = {}) =>
  useMutation({
    mutationFn: authService.refreshJwt,
    ...options
  });
