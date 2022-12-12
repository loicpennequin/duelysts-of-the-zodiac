import z from 'zod';
import type { Game as PrismaGame } from '@prisma/client';
import type { UserDto } from '../user';
import type { Matrix } from '../../types';

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

export type GameWorldDto = {
  map: Matrix<number>;
  playerIds: string[];
};
