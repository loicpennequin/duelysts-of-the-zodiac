import {
  CAMERA_MAX_SCALE,
  CAMERA_MIN_SCALE,
  CAMERA_ROTATE_SCALE,
  CAMERA_SCALE_STEP,
  ONE_FRAME_IN_MS
} from '@renderer/game-engine/constants';
import {
  type Point,
  addVector,
  clamp,
  mulVector,
  subVector,
  PLAYER_ACTION
} from '@dotz/shared';
import { Camera } from './createCamera';
import { throttle } from '@dotz/shared';
import { KeyboardControls } from '@renderer/utils/enums';
import { useKeydownOnce } from '@renderer/composables/useEventListeners';
import { Socket } from '@renderer/utils/socket';
import { PlayerActionTypes } from '@dotz/shared';

export type PlayerControlsOptions = {
  canvas: HTMLCanvasElement;
  camera: Camera;
  mousePosition: Point;
  socket: Socket;
};

export type Directions = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

export class PlayerControls {
  private canvas!: HTMLCanvasElement;

  private camera!: Camera;

  private mousePosition!: Point;

  private isCameraEnabled = false;

  private socket!: Socket;

  private directions: Directions = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  // private isPlayerMovementEnabled = false;

  constructor(opts: PlayerControlsOptions) {
    Object.assign(this, opts);

    this.handleCameraControls();
    // this.handlePlayerMovement();
  }

  enableCamera() {
    this.isCameraEnabled = true;
    return this;
  }

  // enablePlayerMovement() {
  //   this.isPlayerMovementEnabled = true;
  //   return this;
  // }

  disableCamera() {
    this.isCameraEnabled = false;
    return this;
  }

  // disablePlayerMovement() {
  //   this.isPlayerMovementEnabled = false;
  //   return this;
  // }

  private handleCameraScale() {
    this.canvas.addEventListener(
      'wheel',
      e => {
        if (!this.isCameraEnabled) return;
        this.camera.update({
          scale: clamp(
            this.camera.view.scale +
              (e.deltaY > 0 ? CAMERA_SCALE_STEP : -CAMERA_SCALE_STEP),
            {
              min: CAMERA_MIN_SCALE,
              max: CAMERA_MAX_SCALE
            }
          )
        });
      },
      false
    );
  }

  private handleCameraPosition() {
    this.canvas.addEventListener('mousedown', () => {
      if (!this.isCameraEnabled) return;

      let currentPosition = { ...this.mousePosition };

      const update = throttle(() => {
        const diff = mulVector(
          subVector(currentPosition, this.mousePosition),
          -1
        );
        this.camera.update(addVector(this.camera.view, diff));
        currentPosition = { ...this.mousePosition };
      }, ONE_FRAME_IN_MS);

      const stop = () => {
        this.canvas.removeEventListener('mousemove', update);
        this.canvas.removeEventListener('mouseup', stop);
      };

      this.canvas.addEventListener('mousemove', update);
      this.canvas.addEventListener('mouseup', stop);
    });
  }

  private handleCameraControls() {
    if (this.isCameraEnabled) return;

    // this.handleCameraPosition();
    this.handleCameraScale();
  }

  handleMovement(gameId: string) {
    const keyMap: Record<string, keyof typeof this.directions> = {
      [KeyboardControls.W]: 'up',
      [KeyboardControls.S]: 'down',
      [KeyboardControls.A]: 'left',
      [KeyboardControls.D]: 'right'
    };

    const isMovement = (code: string) => Object.keys(keyMap).includes(code);

    useKeydownOnce(e => {
      if (!isMovement(e.code)) {
        return;
      }
      this.directions[keyMap[e.code]] = true;

      return this.socket.emit(PLAYER_ACTION, {
        type: PlayerActionTypes.MOVE,
        gameId,
        payload: this.directions
      });
    });

    document.addEventListener('keyup', e => {
      if (!isMovement(e.code)) {
        return;
      }
      this.directions[keyMap[e.code]] = false;

      return this.socket.emit(PLAYER_ACTION, {
        type: PlayerActionTypes.MOVE,
        gameId,
        payload: this.directions
      });
    });
  }
  // private handlePlayerMovement() {
  //   if (this.isPlayerMovementEnabled) return;
  //   this.player;
  //   const controlsEl = Object.assign(document.createElement('div'), {
  //     className: 'controls'
  //   });

  //   Object.values(NavMeshDirection).forEach(dir => {
  //     controlsEl.appendChild(
  //       Object.assign(document.createElement('button'), {
  //         textContent: dir.toUpperCase(),
  //         onclick: () => {
  //           this.player.move(dir);
  //         }
  //       })
  //     );
  //   });

  //   document.body.appendChild(controlsEl);
  // }
}
