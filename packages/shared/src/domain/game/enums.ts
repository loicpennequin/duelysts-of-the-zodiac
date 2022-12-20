import type { Values } from '../../types';

export const MapCellEdge = {
  NONE: 0,
  ONE_SIDE: 1,
  TWO_SIDES: 2,
  THREE_SIDES: 3,
  ALL_SIDES: 4,
  CORNER: 5
} as const;

export type MapCellEdge = Values<typeof MapCellEdge>;

export const PlayerActionTypes = {
  MOVE: 'move'
} as const;

export type PlayerActionTypes = Values<typeof PlayerActionTypes>;
