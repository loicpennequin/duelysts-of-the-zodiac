import type { ServerToClientEvents, ClientToServerEvents } from '@dotz/shared';
import { authService } from '@renderer/api/auth';
import { io, type Socket } from 'socket.io-client';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.RENDERER_VITE_SERVER_URL,
  {
    autoConnect: false,
    transports: ['websocket'],
    auth: cb => cb({ token: authService.token })
  }
);
