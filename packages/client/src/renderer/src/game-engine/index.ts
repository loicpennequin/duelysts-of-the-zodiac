import {
  AsyncReturnType,
  GAME_WORLD_UPDATE,
  GameWorldDto,
  GameWorldPlayer,
  UserDto,
  clamp
} from '@dotz/shared';
import * as PIXI from 'pixi.js';
import { createCamera } from './createCamera';
import { PlayerControls } from './createControls';
import { createMouseTracker } from './createMouseTracker';
import { createStage } from './createStage';
import { throttle } from '@dotz/shared';
import { TICK_RATE, units } from '@dotz/sdk';

import { createStageEntity } from './createStageEntity';
import { socket } from '@renderer/utils/socket';
import { interpolateEntity } from '@renderer/utils/interpolateEntity';

if (import.meta.env.DEV) {
  // @ts-ignore enables PIXI devtools
  window.PIXI = PIXI;
}

export type GameEngine = AsyncReturnType<typeof createGameEngine>;
export type CreateGameCanvasOptions = {
  container: HTMLElement;
  gameWorld: GameWorldDto;
  gameId: string;
  session: UserDto;
};

export type GameState = {
  players: GameWorldPlayer[];
  playersById: Record<string, GameWorldPlayer>;
  timestamp: number;
};

export type UpdateGameStatePayload = {
  players: GameWorldPlayer[];
};

const createGameState = (): GameState => {
  return {
    players: [],
    playersById: {},
    timestamp: performance.now()
  };
};

export const createGameEngine = async ({
  container,
  gameWorld,
  gameId,
  session
}: CreateGameCanvasOptions) => {
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

  const stage = await createStage(app, gameWorld);

  const players: { id: string; sprite: PIXI.AnimatedSprite }[] =
    await Promise.all(
      gameWorld.players.map(async player => {
        const sprite = await createStageEntity(units.slime, 'idle');
        sprite.position.set(player.position.x, player.position.y);
        sprite.anchor.set(0.5, 0.5);
        app.stage.addChild(sprite);

        return { id: player.id, sprite };
      })
    );
  const playersLookup = Object.fromEntries(players.map(p => [p.id, p]));

  let state = createGameState();
  let prevState = createGameState();

  app.ticker.add(() => {
    const ownPlayer = players.find(player => player.id === session.id);
    if (!ownPlayer) return;

    camera.update({
      x: clamp(ownPlayer.sprite.position.x, {
        min: app.screen.width / 2 / camera.view.scale,
        max: stage.width - app.screen.width / 2 / camera.view.scale
      }),
      y: clamp(ownPlayer.sprite.position.y, {
        min: app.screen.height / 2 / camera.view.scale,
        max: stage.height - app.screen.height / 2 / camera.view.scale
      })
    });
    camera.apply(app);
  });

  app.ticker.add(() => {
    const now = performance.now();
    state.players.forEach(player => {
      const { sprite } = playersLookup[player.id];
      const oldPlayer = prevState.playersById[player.id];

      if (!oldPlayer) return;

      const newPosition = interpolateEntity(
        {
          value: player.position,
          timestamp: state.timestamp
        },
        { value: oldPlayer.position, timestamp: prevState.timestamp },
        { now }
      );

      sprite.position.set(newPosition.x, newPosition.y);
    });
  });

  const onWindowResize = throttle(() => app.resize(), 100);
  window.addEventListener('resize', onWindowResize);

  return {
    canvas,
    updateState(newState: UpdateGameStatePayload) {
      prevState = state;
      state = {
        players: newState.players,
        playersById: Object.fromEntries(newState.players.map(p => [p.id, p])),
        timestamp: performance.now()
      };
    },
    cleanup() {
      window.removeEventListener('resize', onWindowResize);
    }
  };
};
