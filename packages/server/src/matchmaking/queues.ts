import { GAME_FOUND } from '@dotz/shared';
import { User } from '@prisma/client';
import { createGame } from '../game/gameService';
import { getSocket } from '../io';
import { createMatchMaking, MATCHMAKING_EVENTS } from './matchmakingFactory';

export const rankedQueue = createMatchMaking();
rankedQueue.on(MATCHMAKING_EVENTS.PÄIRED, async pair => {
  const users = pair.map(client => client.user) as [User, User];
  try {
    const game = await createGame(users);
    users.forEach(user => {
      const socket = getSocket(user.id);
      socket?.emit(GAME_FOUND, { gameId: game.id });
    });
  } catch (err) {
    // TODO maximum retry ?
    users.forEach(user => {
      rankedQueue.join(user);
    });
    console.log(err);
  }
});
