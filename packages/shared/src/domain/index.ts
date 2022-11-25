import z from 'zod';

export const CreateUserDto = z.object({
  email: z.string().email().trim(),
  password: z.string()
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;

export * from './types';
