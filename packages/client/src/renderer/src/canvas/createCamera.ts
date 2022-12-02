import { Point } from '@dotz/shared';
import { Container } from 'pixi.js';

export type CameraView = Point & {
  scale: number;
  angle: number;
};

export type Camera = ReturnType<typeof createCamera>;

export const createCamera = (defaults: Partial<CameraView>) => {
  const view: CameraView = Object.assign(
    {
      x: 0,
      y: 0,
      scale: 1,
      angle: 0
    },
    defaults
  );

  return {
    get view() {
      return { ...view };
    },
    update(newView: Partial<CameraView>) {
      Object.assign(view, newView);
    },

    apply(stage: Container) {
      stage.position.set(view.x, view.y);
      stage.scale.set(view.scale, view.scale);
    }
  };
};
