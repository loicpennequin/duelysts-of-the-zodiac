import { trpcClient } from '@renderer/trpc';

export const gameService = {
  getSession(id: string) {
    return trpcClient.game.getGameSession.query({ id });
  }
};
