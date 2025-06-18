import { ILocalisation } from '../localisation.interface';
import { Position, Orientation } from '../../../common/common.interface';

export class LocalisationService implements ILocalisation {
  private position: Position = { x: 0, y: 0, z: 0 };
  private orientation: Orientation = { orientation: 'N' };

  updatePosition(position: Position): void {
    this.position = { ...position };
  }

  getPosition(): Position {
    return { ...this.position };
  }

  getOrientation(): Orientation {
    return { ...this.orientation };
  }

  setOrientation(orientation: Orientation): void {
    this.orientation = { ...orientation };
  }

  turnLeft(): Orientation {
    // Rotation dans le sens inverse des aiguilles d'une montre: N -> W -> S -> E -> N
    switch (this.orientation.orientation) {
      case 'N':
        this.orientation = { orientation: 'W' };
        break;
      case 'W':
        this.orientation = { orientation: 'S' };
        break;
      case 'S':
        this.orientation = { orientation: 'E' };
        break;
      case 'E':
        this.orientation = { orientation: 'N' };
        break;
    }
    
    return this.getOrientation();
  }

  turnRight(): Orientation {
    // Rotation dans le sens des aiguilles d'une montre: N -> E -> S -> W -> N
    switch (this.orientation.orientation) {
      case 'N':
        this.orientation = { orientation: 'E' };
        break;
      case 'E':
        this.orientation = { orientation: 'S' };
        break;
      case 'S':
        this.orientation = { orientation: 'W' };
        break;
      case 'W':
        this.orientation = { orientation: 'N' };
        break;
    }
    
    return this.getOrientation();
  }
}
