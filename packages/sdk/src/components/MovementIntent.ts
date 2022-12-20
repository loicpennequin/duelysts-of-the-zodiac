import { Component } from '../factories/createEcs';

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
