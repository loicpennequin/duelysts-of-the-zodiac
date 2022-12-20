import { type MapLayout, random } from '@dotz/shared';
import { Position } from '../components/Position';
import type { ECS } from './createEcs';
import { MovementIntent } from '../components/MovementIntent';
import { Player } from '../components/Player';

export type CreatePlayerOptions = {
  id: string;
  ecs: ECS;
  map: MapLayout;
};
export const createPlayer = ({ id, ecs, map }: CreatePlayerOptions) => {
  const entity = ecs.addEntity();
  ecs.addComponent(entity, new Player(id));
  ecs.addComponent(
    entity,
    new Position({
      x: random(map.width),
      y: random(map.height)
    })
  );
  ecs.addComponent(
    entity,
    new MovementIntent({ up: false, down: false, left: false, right: false })
  );

  return {
    toDto() {
      return {
        id: ecs.getComponents(entity).get(Player).playerId,
        entityId: entity,
        position: ecs.getComponents(entity).get(Position).position
      };
    }
  };
};
