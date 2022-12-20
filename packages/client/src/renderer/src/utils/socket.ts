import type { ServerToClientEvents, ClientToServerEvents } from '@dotz/shared';
import { authService } from '@renderer/api/auth';
import { io, type Socket as GenericSocket } from 'socket.io-client';

export const socket: GenericSocket<ServerToClientEvents, ClientToServerEvents> =
  io(import.meta.env.RENDERER_VITE_SERVER_URL, {
    autoConnect: false,
    transports: ['websocket'],
    auth: cb => cb({ token: authService.token })
  });

export type Socket = typeof socket;
