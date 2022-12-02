import { GameSessionDto } from '@dotz/shared';
import { Stage, stages } from '@dotz/sdk';
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
  gameSession: GameSessionDto
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

  window.addEventListener(
    'resize',
    throttle(() => app.resize(), 100)
  );
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  const stage = stages[gameSession.stageId] as Stage;

  const camera = createCamera({
    x: app.screen.width / 2,
    y: 100,
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
  await createStage(app, stage);

  app.ticker.add(() => {
    camera.apply(app.stage);
  });

  return canvas;
};
