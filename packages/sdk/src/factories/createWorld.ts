import { type GameWorldDto, randomInt, type Point } from '@dotz/shared';
import { createMap } from './createMap';
import { Component, ECS, System, type Entity } from './createEcs';

class Position extends Component {
  constructor(public position: Point) {
    super();
  }
}

export class Player extends Component {
  constructor(public playerId: string) {
    super();
  }
}

export type Directions = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

export class MovementIntent extends Component {
  constructor(public directions: Directions) {
    super();
  }
}

class MovementSystem extends System {
  componentsRequired = new Set([Position, MovementIntent]);

  speed = 5;

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

export type GameWorld = GameWorldDto & { ecs: ECS; destroy: () => void };

const CELL_SIZE = 32;

export const createWorld = (
  playerIds: string[],
  onUpdate: (world: GameWorld) => void
): GameWorld => {
  const map = createMap();

  const ecs = new ECS();

  const players = playerIds.map(playerId => {
    const entity = ecs.addEntity();
    ecs.addComponent(entity, new Player(playerId));
    ecs.addComponent(
      entity,
      new Position({
        x: randomInt(map.width * CELL_SIZE),
        y: randomInt(map.height * CELL_SIZE)
      })
    );
    ecs.addComponent(
      entity,
      new MovementIntent({ up: false, down: false, left: false, right: false })
    );

    return entity;
  });

  ecs.addSystem(new MovementSystem());

  const TICK_RATE = 20;
  const getWorld = () => ({
    map,
    ecs,
    players: players.map(entity => ({
      id: ecs.getComponents(entity).get(Player).playerId,
      entityId: entity,
      position: ecs.getComponents(entity).get(Position).position
    })),
    destroy() {
      clearInterval(loop);
    }
  });

  const loop = setInterval(() => {
    ecs.update();
    onUpdate(getWorld());
  }, 1000 / TICK_RATE);

  return getWorld();
};
