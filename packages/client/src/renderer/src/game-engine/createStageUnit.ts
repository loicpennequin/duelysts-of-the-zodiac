import { Unit } from '@dotz/sdk';
import {
  createSpritesheetFrameObject,
  parseAsperiteAnimationSheet
} from '@renderer/utils/canvas';
import { AnimationState } from '@renderer/utils/constants';
import * as PIXI from 'pixi.js';
import { AdvancedBloomFilter } from '@pixi/filter-advanced-bloom';

const loadedTextures = new Map<string, Promise<PIXI.Texture>>();

export const createStageUnit = async (
  unit: Unit,
  startAnimation = AnimationState.IDLE
) => {
  const path = `/units/${unit.id}.png`;
  // avoid console warinings with HMR
  if (!loadedTextures.has(path)) {
    loadedTextures.set(path, PIXI.Assets.load(path) as Promise<PIXI.Texture>);
  }

  const texture = (await loadedTextures.get(path)) as PIXI.Texture;

  const data = parseAsperiteAnimationSheet(unit.spritesheetData);
  const spritesheet = new PIXI.Spritesheet(texture, data);
  await spritesheet.parse();
  const sprite = new PIXI.AnimatedSprite(
    createSpritesheetFrameObject(startAnimation, spritesheet, data)
  );
  sprite.filters = [
    new AdvancedBloomFilter({ threshold: 0.4, bloomScale: 0.5 })
  ];

  sprite.position.x = sprite.position.x - sprite.width / 4;
  sprite.position.y = sprite.position.y - sprite.height / 2;

  sprite.play();
  // setting interactive.false doesnt seem to work when inide an interactive container
  sprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

  return sprite;
};
