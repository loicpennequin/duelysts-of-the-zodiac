import { testStage } from './testStage';
import type { Stage } from './types';

export const getRandomStage = (): Stage => {
  return testStage;
};

export const stages = {
  'test-stage': testStage
};

export * from './types';
