import { Unit } from '@dotz/sdk';
import {
  createSpritesheetFrameObject,
  parseAsperiteAnimationSheet
} from '@renderer/utils/canvas';
import { AnimationState } from '@renderer/utils/constants';
import * as PIXI from 'pixi.js';
import { spritePaths } from './sprites';

const loadedTextures = new Map<string, Promise<PIXI.Texture>>();

export const createStageEntity = async (
  unit: Unit,
  initialAnimation = AnimationState.IDLE
) => {
  const path = spritePaths.entities[unit.id];
  // avoid console warinings with HMR
  if (!loadedTextures.has(path)) {
    loadedTextures.set(path, PIXI.Assets.load(path) as Promise<PIXI.Texture>);
  }

  const texture = (await loadedTextures.get(path)) as PIXI.Texture;

  const data = parseAsperiteAnimationSheet(unit.spritesheetData);
  const spritesheet = new PIXI.Spritesheet(texture, data);
  await spritesheet.parse();

  const sprite = new PIXI.AnimatedSprite(
    createSpritesheetFrameObject(initialAnimation, spritesheet, data)
  );

  sprite.play();

  return sprite;
};
