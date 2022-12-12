export interface AsepriteSheet {
  frames: FrameElement[];
  meta: Meta;
}

export interface FrameElement {
  filename: string;
  frame: SpriteSourceSizeClass;
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: SpriteSourceSizeClass;
  sourceSize: Size;
  duration: number;
}

export interface SpriteSourceSizeClass {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Size {
  w: number;
  h: number;
}

export interface Meta {
  app: string;
  version: string;
  image: string;
  format: string;
  size: Size;
  scale: string;
  frameTags: FrameTag[];
}

export interface FrameTag {
  name: string;
  from: number;
  to: number;
  direction: string;
}

export type Unit = {
  id: string;
  spritesheetData: AsepriteSheet;
};
