import { Position, RoverState } from '../../common/common.interface';

export interface IMovement {
  moveForward(): RoverState;
  moveBackward(): RoverState;
  turnLeft(): RoverState;
  turnRight(): RoverState;
}
