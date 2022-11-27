import { authService } from '@renderer/api/auth';

export const useLogin = (options = {}) => {
  const { push } = useRouter();

  return useMutation(
    computed(() => ({
      mutationFn: authService.login,
      ...unref(options),
      onSuccess() {
        push({ name: 'Home' });
      }
    }))
  );
};

export const useLogout = (options = {}) => {
  const { push } = useRouter();
  const qc = useQueryClient();

  return useMutation(
    computed(() => ({
      mutationFn: authService.logout,
      ...unref(options),
      onSuccess() {
        push({ name: 'Login' });
        qc.removeQueries(['session']);
      }
    }))
  );
};

export const useRefreshJwt = (options = {}) =>
  useMutation(
    computed(() => ({
      mutationFn: authService.refreshJwt,
      ...unref(options)
    }))
  );
