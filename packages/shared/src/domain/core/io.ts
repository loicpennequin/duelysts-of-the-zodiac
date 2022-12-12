import type { GameSessionDto, GameWorldDto } from '../game';
import { GAME_ENDED, GAME_FOUND, GET_GAME_WORLD, PING } from './events';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ServerToClientEvents = {
  [GAME_FOUND]: (payload: { gameId: string }) => void;
  [GAME_ENDED]: (payload: { gameSession: GameSessionDto }) => void;
};

export type ClientToServerEvents = {
  [PING]: (timestamp: number, callback: (e: number) => void) => void;
  [GET_GAME_WORLD]: (
    gameId: string,
    callback: (e: GameWorldDto) => void
  ) => void;
};
