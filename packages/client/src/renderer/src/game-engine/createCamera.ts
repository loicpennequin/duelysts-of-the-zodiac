import { Point } from '@dotz/shared';
import { Application } from 'pixi.js';

export type CameraView = Point & {
  scale: number;
};

export type Camera = ReturnType<typeof createCamera>;

export const createCamera = (defaults: Partial<CameraView>) => {
  const view: CameraView = Object.assign(
    {
      x: 0,
      y: 0,
      scale: 2
    },
    defaults
  );

  return {
    get view() {
      return { ...view };
    },
    update(newView: Partial<CameraView>) {
      Object.assign(view, newView);
      console.log(view);
    },

    apply(app: Application) {
      const { stage, screen } = app;

      stage.position.set(
        view.x * -1 * view.scale + screen.width / 2,
        view.y * -1 * view.scale + screen.height / 2
      );
      stage.scale.set(view.scale, view.scale);
    }
  };
};
