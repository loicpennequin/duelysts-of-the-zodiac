import { Server, Socket } from 'socket.io';
import type http from 'http';
import { User } from '@prisma/client';
import { authenticate } from '../auth/authService';
import { handleCORS } from './cors';
import {
  ClientToServerEvents,
  noop,
  PING,
  ServerToClientEvents
} from '@dotz/shared';
import { rankedQueue } from '../matchmaking/queues';
import { findGame } from '../game/gameService';
import { SOCKET_ROOMS } from '../constants';
import { getWorldById } from '../game/gameWorldService';
import { GET_GAME_WORLD } from '@dotz/shared';

let io: Server<ClientToServerEvents, ServerToClientEvents>;
const usersBySocket = new Map<Socket, User>();
const socketsByUserId = new Map<string, Socket>();

export const getSocket = (userId: string) => socketsByUserId.get(userId);
export const getIo = () => {
  if (!io) throw new Error('referencing io before initialization');
  return io;
};

export const initIO = (server: http.Server) => {
  io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: handleCORS,
      methods: ['GET', 'POST']
    }
  });

  const connectToOngoingGameRoom = async (socket: Socket) => {
    const user = usersBySocket.get(socket);
    if (!user) return;

    const game = await findGame({
      where: {
        endedAt: null,
        gameUsers: {
          some: {
            userId: user.id
          }
        }
      },
      include: { gameUsers: { include: { user: true } } }
    });
    if (!game) return;
    socket.join(SOCKET_ROOMS.GAME(game))?.catch(console.log);
  };

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
    connectToOngoingGameRoom(socket).catch(noop);

    socket.on('disconnect', () => {
      const user = usersBySocket.get(socket);
      if (user) {
        socketsByUserId.delete(user.id);
        rankedQueue.leave(user);
        // @TODO broadcast event in ongoing game room if applicable
        // @TODO start timer to auto surrender ongoing game
      }

      usersBySocket.delete(socket);
    });

    socket.on(GET_GAME_WORLD, async (id, callback) => {
      try {
        const world = await getWorldById(id);
        callback(world);
      } catch (err) {
        console.log(err);
      }
    });
  });
};
