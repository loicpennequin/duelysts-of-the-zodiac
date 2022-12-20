import { GAME_WORLD_UPDATE, GameWorldDto } from '@dotz/shared';
import * as PIXI from 'pixi.js';
import { createCamera } from './createCamera';
import { PlayerControls } from './createControls';
import { createMouseTracker } from './createMouseTracker';
import { createStage } from './createStage';
import { throttle } from '@dotz/shared';
import { Graphics } from 'pixi.js';
import { units } from '@dotz/sdk';

import { createStageEntity } from './createStageEntity';
import { socket } from '@renderer/utils/socket';
import { useSocketEvent } from '@renderer/composables/useSocket';

if (import.meta.env.DEV) {
  // @ts-ignore enables PIXI devtools
  window.PIXI = PIXI;
}

export const createGameCanvas = async (
  container: HTMLElement,
  gameWorld: GameWorldDto,
  gameId: string
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
    camera,
    socket
  });
  controls.enableCamera();
  controls.handleMovement(gameId);

  await createStage(app, gameWorld);

  const players = await Promise.all(
    gameWorld.players.map(async player => {
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
      return { id: player.id, sprite };
    })
  );

  useSocketEvent(GAME_WORLD_UPDATE, payload => {
    payload.players.forEach(playerUpdate => {
      const player = players.find(p => p.id === playerUpdate.id);
      player?.sprite.position.set(
        playerUpdate.position.x,
        playerUpdate.position.y
      );
    });
  });

  app.ticker.add(() => {
    camera.update({
      x: players[0].sprite.position.x,
      y: players[0].sprite.position.y
    });
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
