import tileset from '../assets/tilesets/base.json';
import map from '../assets/stages/test.json';
import type { Stage } from './types';

export const testStage: Stage = {
  id: 'test-stage',
  tileset,
  map
};
