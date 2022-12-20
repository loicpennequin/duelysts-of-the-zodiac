import type { Point } from '@dotz/shared';
import { Component } from '../factories/createEcs';

export class Position extends Component {
  constructor(public position: Point) {
    super();
  }
}
