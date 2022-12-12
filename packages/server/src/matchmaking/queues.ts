import { GAME_FOUND } from '@dotz/shared';
import { User } from '@prisma/client';
import { SOCKET_ROOMS } from '../constants';
import { createGame } from '../game/gameService';
import { getSocket } from '../core/io';
import { createMatchMaking, MATCHMAKING_EVENTS } from './matchmakingFactory';

export const rankedQueue = createMatchMaking();
rankedQueue.on(MATCHMAKING_EVENTS.PAIRED, async pair => {
  const users = pair.map(client => client.user) as [User, User];
  try {
    const game = await createGame(users);
    users.forEach(user => {
      const socket = getSocket(user.id)!;

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      socket.join(SOCKET_ROOMS.GAME(game));
      socket.emit(GAME_FOUND, { gameId: game.id });
    });
  } catch (err) {
    // TODO add maximum retries ?
    users.forEach(user => {
      rankedQueue.join(user);
    });
    console.log(err);
  }
});
