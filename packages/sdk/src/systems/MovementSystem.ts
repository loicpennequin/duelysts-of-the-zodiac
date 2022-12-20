import { MovementIntent } from '../components/MovementIntent';
import { Position } from '../components/Position';
import { System, type Entity } from '../factories/createEcs';

export class MovementSystem extends System {
  componentsRequired = new Set([Position, MovementIntent]);

  speed = 15;

  update(entities: Set<Entity>): void {
    [...entities].forEach(entity => {
      const { directions } = this.ecs.getComponents(entity).get(MovementIntent);
      const { position } = this.ecs.getComponents(entity).get(Position);

      if (directions.up) {
        position.y -= this.speed;
      }
      if (directions.down) {
        position.y += this.speed;
      }
      if (directions.left) {
        position.x -= this.speed;
      }
      if (directions.right) {
        position.x += this.speed;
      }
    });
  }
}
