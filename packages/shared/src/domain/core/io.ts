import type { GameSessionDto, GameWorldDto, GameWorldPlayer } from '../game';
import {
  GAME_ENDED,
  GAME_FOUND,
  GAME_WORLD_UPDATE,
  GET_GAME_WORLD,
  PING,
  PLAYER_ACTION
} from './events';

type MoveActionPayload = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

type MoveAction = {
  type: 'move';
  gameId: string;
  payload: MoveActionPayload;
};

export type PlayerAction = MoveAction;
// eslint-disable-next-line @typescript-eslint/ban-types
export type ServerToClientEvents = {
  [GAME_FOUND]: (payload: { gameId: string }) => void;
  [GAME_ENDED]: (payload: { gameSession: GameSessionDto }) => void;
  [GAME_WORLD_UPDATE]: (payload: { players: GameWorldPlayer[] }) => void;
};

export type ClientToServerEvents = {
  [PING]: (timestamp: number, callback: (e: number) => void) => void;
  [GET_GAME_WORLD]: (
    gameId: string,
    callback: (e: GameWorldDto) => void
  ) => void;
  [PLAYER_ACTION]: (e: PlayerAction) => void;
};
