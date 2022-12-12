import { trpcClient } from '@renderer/trpc';

export const gameService = {
  createSinglePlayerGame() {
    return trpcClient.game.createSinglePlayerGame.mutate();
  },

  getSession(id: string) {
    return trpcClient.game.getGameSession.query({ id });
  },

  getOngoingGame() {
    return trpcClient.game.getOngoingGame.query();
  },

  surrender(id: string) {
    return trpcClient.game.surrender.mutate({ id });
  }
};
