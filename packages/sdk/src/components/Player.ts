import { Component } from '../factories/createEcs';

export class Player extends Component {
  constructor(public playerId: string) {
    super();
  }
}
