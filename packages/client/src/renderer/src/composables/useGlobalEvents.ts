import { GAME_FOUND } from '@dotz/shared';
import { useLogout } from './useAuth';
import { useSocketEvent } from './useSocket';

export const useGlobalEvents = () => {
  const router = useRouter();

  const { mutate: logout } = useLogout();

  useSocketEvent('connect_error', () => {
    if (import.meta.env.DEV) return;
    logout();
  });
  useSocketEvent('disconnect', () => {
    if (import.meta.env.DEV) return;
    logout();
  });
  useSocketEvent(GAME_FOUND, payload => {
    router.push({ name: 'GameSession', params: { id: payload.gameId } });
  });
};
