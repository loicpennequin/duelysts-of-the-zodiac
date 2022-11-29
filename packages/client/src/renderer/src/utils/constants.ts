import { MaybeRef } from '@vueuse/core';

export const queryKeys = {
  SESSION: () => ['session'],
  GAME_SESSION: (id: MaybeRef<string>) => ['game session', unref(id)],
  ONGOING_GAME: () => ['ongoing game']
} as const;

export const REMEMBER_ME_LOCAL_STORAGE = 'remember-me';
