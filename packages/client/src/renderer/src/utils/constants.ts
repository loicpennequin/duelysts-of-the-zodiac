import { Values } from '@dotz/shared';
import { MaybeRef } from '@vueuse/core';

export const queryKeys = {
  SESSION: () => ['session'],
  GAME_SESSION: (id: MaybeRef<string>) => ['game session', unref(id)],
  ONGOING_GAME: () => ['ongoing game']
} as const;

export const REMEMBER_ME_LOCAL_STORAGE = 'remember-me';

export const AnimationState = {
  IDLE: 'idle'
};
export type AnimationState = Values<typeof AnimationState>;
