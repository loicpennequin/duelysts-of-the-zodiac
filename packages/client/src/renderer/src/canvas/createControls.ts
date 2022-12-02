import {
  CAMERA_MAX_SCALE,
  CAMERA_MIN_SCALE,
  CAMERA_ROTATE_SCALE,
  CAMERA_SCALE_STEP,
  ONE_FRAME_IN_MS
} from '@renderer/canvas/constants';
import {
  type Point,
  addVector,
  clamp,
  mulVector,
  subVector
} from '@dotz/shared';
import { Camera } from './createCamera';
import { throttle } from '@dotz/shared';

export type PlayerControlsOptions = {
  canvas: HTMLCanvasElement;
  camera: Camera;
  mousePosition: Point;
};

export class PlayerControls {
  private canvas!: HTMLCanvasElement;

  private camera!: Camera;

  private mousePosition!: Point;

  private isCameraEnabled = false;

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

  private handleCameraRotation() {
    document.addEventListener('keyup', e => {
      if (!this.isCameraEnabled) return;
      switch (e.code) {
        case 'KeyQ':
          this.camera.update({
            angle: (this.camera.view.angle -= CAMERA_ROTATE_SCALE)
          });
          break;
        case 'KeyE':
          this.camera.update({
            angle: (this.camera.view.angle += CAMERA_ROTATE_SCALE)
          });
          break;
      }
    });
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

    this.handleCameraPosition();
    this.handleCameraScale();
    this.handleCameraRotation();
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
