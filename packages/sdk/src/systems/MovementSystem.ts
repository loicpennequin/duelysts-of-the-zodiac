import { addVector, type MapLayout, type Point } from '@dotz/shared';
import { MovementIntent, type Directions } from '../components/MovementIntent';
import { Position } from '../components/Position';
import { System, type Entity } from '../factories/createEcs';

export class MovementSystem extends System {
  componentsRequired = new Set([Position, MovementIntent]);

  private get speed() {
    return this.map.width * 0.01;
  }

  constructor(private map: MapLayout) {
    super();
  }

  private getDiff(directions: Directions): Point {
    const position = { x: 0, y: 0 };

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
    return position;
  }

  checkDestinationValidity({ x, y }: Point) {
    return x > 0 && x < this.map.width && y > 0 && y < this.map.height;
  }

  update(entities: Set<Entity>): void {
    entities.forEach(entity => {
      const { directions } = this.ecs.getComponents(entity).get(MovementIntent);
      const { position } = this.ecs.getComponents(entity).get(Position);

      const diff = this.getDiff(directions);
      const newPosition = addVector(position, diff);

      if (this.checkDestinationValidity(newPosition)) {
        Object.assign(position, newPosition);
      }
    });
  }
}
