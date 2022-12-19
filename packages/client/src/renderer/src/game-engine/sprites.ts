import baseTileset from '@dotz/sdk/assets/tilesets/base-tiles.png';

import seiya from '@dotz/sdk/assets/units/seiya.png';
import slime from '@dotz/sdk/assets/units/slime.png';

export const spritePaths = {
  tileSets: { base: baseTileset },

  entities: {
    seiya,
    slime
  }
} as const;
