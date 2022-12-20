import { GAME_FOUND } from '@dotz/shared';
import { User } from '@prisma/client';
import { SOCKET_ROOMS } from '../constants';
import { createGame } from '../game/gameService';
import { getSocket } from '../core/io';
import { createMatchMaking, MATCHMAKING_EVENTS } from './matchmakingFactory';

export const rankedQueue = createMatchMaking();
rankedQueue.on(MATCHMAKING_EVENTS.PAIRED, async pair => {
  const users = pair.map(client => client.user);
  try {
    const userIds = users.map(user => user.id);
    await createGame(userIds, {});
  } catch (err) {
    // TODO add maximum retries ?
    users.forEach(user => {
      rankedQueue.join(user);
    });
    console.log(err);
  }
});
