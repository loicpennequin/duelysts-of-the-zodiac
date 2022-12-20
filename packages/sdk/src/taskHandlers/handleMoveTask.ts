import type { GameWorldTaskPayload } from '../factories';
import type { ECS } from '../factories/createEcs';
import { Player } from '../components/Player';
import { MovementIntent } from '../components/MovementIntent';
import { isDefined } from '@dotz/shared';

export const handleMoveTask = (action: GameWorldTaskPayload, ecs: ECS) => {
  const player = ecs.getEntitiesByComponent(Player).find(entity => {
    return ecs.getComponents(entity).get(Player).playerId === action.playerId;
  });

  if (!isDefined(player)) return;

  const components = ecs.getComponents(player);
  if (!components.has(MovementIntent)) return;
  Object.assign(components.get(MovementIntent).directions, action.payload);
};
