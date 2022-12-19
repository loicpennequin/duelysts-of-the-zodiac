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
    },

    apply(app: Application) {
      const { stage, screen } = app;

      // we are multiplying the view position by -1 because it is actually the stage that is moving, not the camera
      // so if want to scroll to the right for example, we need to move the stage to he left
      stage.position.set(
        view.x * -1 * view.scale + screen.width / 2,
        view.y * -1 * view.scale + screen.height / 2
      );
      stage.scale.set(view.scale, view.scale);
    }
  };
};
