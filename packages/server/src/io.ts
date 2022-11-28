import { Server, Socket } from 'socket.io';
import type http from 'http';
import { User } from '@prisma/client';
import { authenticate } from './auth/authService';
import { handleCORS } from './core/cors';
import { ClientToServerEvents, PING, ServerToClientEvents } from '@dotz/shared';

export const initIO = (server: http.Server) => {
  const usersBySocket = new Map<Socket, User>();
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
      console.log('io middleware', token);
      if (!token) throw new Error('no token provided');
      usersBySocket.set(socket, await authenticate(token));
      console.log('io middleware user', usersBySocket.get(socket));
      next();
    } catch (err) {
      console.log('io middleware error', err);
      next(err as Error);
    }
  });

  io.on('connection', socket => {
    console.log('new socket connection');
    socket.on('disconnect', () => {
      console.log('new socket disconnect');
      usersBySocket.delete(socket);
    });

    socket.on(PING, (timestamp, callback) => {
      callback(timestamp);
    });
  });
};
