import { GAME_FOUND, PING } from './events';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ServerToClientEvents = {
  [GAME_FOUND]: (payload: { gameId: string }) => void;
};

export type ClientToServerEvents = {
  [PING]: (timestamp: number, callback: (e: number) => void) => void;
};
