import { GameWorldDto } from '@dotz/shared';
import * as PIXI from 'pixi.js';
import { createCamera } from './createCamera';
import { PlayerControls } from './createControls';
import { createMouseTracker } from './createMouseTracker';
import { createStage } from './createStage';
import { throttle } from '@dotz/shared';
import { Graphics } from 'pixi.js';
import { units } from '@dotz/sdk';

import { createStageEntity } from './createStageEntity';

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

  const camera = createCamera({
    x: 300,
    y: 300,
    scale: 2
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

  gameWorld.players.forEach(async player => {
    console.log(player.position);
    const sprite = await createStageEntity(units.slime, 'idle');
    sprite.position.set(player.position.x, player.position.y);
    sprite.anchor.set(0.5, 0.5);
    app.stage.addChild(sprite);
    // const graphics = new PIXI.Graphics();
    // graphics.beginFill(player.color);
    // graphics.drawCircle(player.position.x, player.position.y, 16);
    // graphics.endFill();
    // container.addChild(graphics);

    camera.update({
      x: player.position.x,
      y: player.position.y
    });
  });

  app.ticker.add(() => {
    camera.apply(app);
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
