import { PING } from './events';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ServerToClientEvents = {};

export type ClientToServerEvents = {
  [PING]: (timestamp: number, callback: (e: number) => void) => void;
};
