import type TypedEmitter from 'typed-emitter';
import { EventEmitter } from 'events';
import {
  PlayerActionTypes,
  type GameWorldDto,
  type GameWorldPlayer
} from '@dotz/shared';
import { createMap } from './createMap';
import { ECS, createEcs } from './createEcs';
import { MovementSystem } from '../systems/MovementSystem';
import { createPlayer } from './createPlayer';
import { createTaskQueue } from './createTaskQueue';
import type { PlayerAction } from '@dotz/shared';
import { handleMoveTask } from '../taskHandlers/handleMoveTask';
import { TICK_RATE } from '../constants';

export type GameWorld = GameWorldDto & {
  ecs: ECS;
  on: TypedEmitter<GameWorldEvents>['on'];
  schedule: (payload: GameWorldTaskPayload) => void;
  start: () => void;
  destroy: () => void;
};

export type GameUpdatePayload = {
  players: GameWorldPlayer[];
};

export type GameWorldEvents = {
  update: (payload: GameUpdatePayload) => void;
};

export type GameWorldTask = (payload: GameWorldTaskPayload) => void;
export type GameWorldTaskPayload = PlayerAction & { playerId: string };
export type GameWorldTaskHandler = (
  action: GameWorldTaskPayload,
  ecs: ECS
) => void;

const taskLookup = {
  [PlayerActionTypes.MOVE]: handleMoveTask
} satisfies Record<PlayerActionTypes, GameWorldTaskHandler>;

export const createWorld = (playerIds: string[]): GameWorld => {
  const map = createMap();
  const ecs = createEcs([new MovementSystem(map)]);
  const players = playerIds.map(id => createPlayer({ id, ecs, map }));
  const emitter = new EventEmitter() as TypedEmitter<GameWorldEvents>;
  const queue = createTaskQueue();

  let tickInterval: ReturnType<typeof setInterval>;

  const tick = () => {
    queue.process();
    ecs.update();
    emitter.emit('update', {
      players: players.map(player => player.toDto())
    });
  };

  return {
    map,
    ecs,
    players: players.map(player => player.toDto()),
    on: emitter.on.bind(emitter),
    schedule: (action: GameWorldTaskPayload) => {
      queue.schedule(() => {
        taskLookup[action.type](action, ecs);
      });
    },
    start: () => {
      tickInterval = setInterval(tick, 1000 / TICK_RATE);
    },
    destroy() {
      clearInterval(tickInterval);
    }
  };
};
