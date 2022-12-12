import { GameSessionDto, GameWorldDto } from '@dotz/shared';
import * as PIXI from 'pixi.js';
import { createCamera } from './createCamera';
import { PlayerControls } from './createControls';
import { createMouseTracker } from './createMouseTracker';
import { createStage } from './createStage';
import { throttle } from '@dotz/shared';

if (import.meta.env.DEV) {
  // @ts-ignore enables PIXI devtools
  window.PIXI = PIXI;
}

export const createGameCanvas = async (
  container: HTMLElement,
  gameWorld: GameWorldDto
) => {
  const { width, height } = container.getBoundingClientRect();

  const app = new PIXI.Application({
    width,
    height,
    autoDensity: true,
    antialias: false,
    backgroundAlpha: 0,
    resizeTo: container
  });
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  PIXI.settings.SORTABLE_CHILDREN = true;

  app.stage.pivot = { x: 0.5, y: 0.5 };

  const camera = createCamera({
    x: 0,
    y: 0,
    scale: 1,
    angle: 0
  });

  const canvas = app.view as unknown as HTMLCanvasElement;
  const mouseTracker = createMouseTracker(canvas);
  const controls = new PlayerControls({
    mousePosition: mouseTracker,
    canvas,
    camera
  });
  controls.enableCamera();
  await createStage(app, gameWorld);

  app.ticker.add(() => {
    camera.apply(app.stage);
  });

  const onWindowResize = throttle(() => app.resize(), 100);
  window.addEventListener('resize', onWindowResize);

  return {
    canvas,
    cleanup() {
      window.removeEventListener('resize', onWindowResize);
    }
  };
};
