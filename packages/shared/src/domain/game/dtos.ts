import z from 'zod';
import type { Game as PrismaGame } from '@prisma/client';
import type { UserDto } from '../user';
import type { MapCellEdge } from './enums';
import type { Point } from '../../types';

export type GameSessionDto = PrismaGame & {
  users: UserDto[];
  winnerId?: string;
};

export const GetGameSessionDto = z.object({
  id: z.string()
});
export type GetGameSessionDto = z.infer<typeof GetGameSessionDto>;

export const SurrenderGameDto = z.object({
  id: z.string()
});
export type SurrenderGameDto = z.infer<typeof SurrenderGameDto>;

export type GameWorldPlayer = {
  id: string;
  position: Point;
  entityId: number;
};
export type GameWorldDto = {
  map: MapLayout;
  players: GameWorldPlayer[];
};

export type MapCellAngle = 0 | 90 | 180 | 270;

export type MapCell = {
  terrain: number;
  edge: MapCellEdge;
  angle: MapCellAngle;
};

export type MapLayout = {
  width: number;
  height: number;
  cells: MapCell[];
};
