import { Position, Obstacle, Orientation } from '../../common/common.interface';

export interface IMap {
  updateMap(position: Position, obstacles: Obstacle[], orientation?: Orientation): void;
  displayMap(): void;
}