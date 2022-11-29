import z from 'zod';
import type { Game as PrismaGame } from '@prisma/client';
import type { UserDto } from '../user';

export const GetGameSessionDto = z.object({
  id: z.string()
});

export type GetGameSessionDto = z.infer<typeof GetGameSessionDto>;

export type GameSessionDto = PrismaGame & {
  users: UserDto[];
};
