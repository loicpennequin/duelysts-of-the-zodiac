import { GAME_FOUND, noop } from '@dotz/shared';
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
      const socket = getSocket(user.id);
      if (!socket) throw new Error("Couldn't find socket associated with user");

      socket.join(SOCKET_ROOMS.GAME(game))?.catch(noop);
      socket.emit(GAME_FOUND, { gameId: game.id });
    });
  } catch (err) {
    // TODO maximum retry ?
    users.forEach(user => {
      rankedQueue.join(user);
    });
    console.log(err);
  }
});
