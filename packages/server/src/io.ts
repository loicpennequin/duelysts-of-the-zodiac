import { Server, Socket } from 'socket.io';
import type http from 'http';
import { User } from '@prisma/client';
import { authenticate } from './auth/authService';
import { handleCORS } from './core/cors';
import { ClientToServerEvents, PING, ServerToClientEvents } from '@dotz/shared';
import { rankedQueue } from './matchmaking/queues';

const usersBySocket = new Map<Socket, User>();
const socketsByUserId = new Map<string, Socket>();

export const getSocket = (userId: string) => socketsByUserId.get(userId);

export const initIO = (server: http.Server) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: handleCORS,
      methods: ['GET', 'POST']
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token as string;
      if (!token) throw new Error('no token provided');

      const user = await authenticate(token);
      usersBySocket.set(socket, user);
      socketsByUserId.set(user.id, socket);
      next();
    } catch (err) {
      next(err as Error);
    }
  });

  io.on('connection', socket => {
    socket.on('disconnect', () => {
      const user = usersBySocket.get(socket);
      if (user) {
        socketsByUserId.delete(user.id);
        rankedQueue.leave(user);
      }

      usersBySocket.delete(socket);
    });

    socket.on(PING, (timestamp, callback) => {
      callback(timestamp);
    });
  });
};
