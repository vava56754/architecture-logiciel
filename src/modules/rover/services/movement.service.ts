import { IMovement } from '../movement.interface';
import { Position, RoverState } from '../../../common/common.interface';
import { ILocalisation } from '../localisation.interface';
import { IObstacles } from '../obstacles.interface';

export class MovementService implements IMovement {
  private speed: number = 1;
  private moving: boolean = false;
  
  constructor(
    private localisation: ILocalisation,
    private obstacles: IObstacles
  ) {}

  moveForward(): RoverState {
    this.moving = true;
    
    const currentPosition = this.localisation.getPosition();
    const orientation = this.localisation.getOrientation();
    
    // Calcul de la nouvelle position en fonction de l'orientation
    let newPosition: Position = { ...currentPosition };
    
    switch (orientation.orientation) {
      case 'N':
        newPosition.y += this.speed;
        break;
      case 'E':
        newPosition.x += this.speed;
        break;
      case 'S':
        newPosition.y -= this.speed;
        break;
      case 'W':
        newPosition.x -= this.speed;
        break;
    }
    
    // Vérification de la présence d'obstacles
    const obstacleDetected = !this.obstacles.isPathClear(newPosition);
    
    // Si pas d'obstacle, mettre à jour la position
    if (!obstacleDetected) {
      this.localisation.updatePosition(newPosition);
    }
    
    this.moving = false;
    
    // Retourner l'état du rover
    return {
      position: this.localisation.getPosition(),
      orientation: this.localisation.getOrientation(),
      obstacleDetected
    };
  }

  moveBackward(): RoverState {
    this.moving = true;
    
    const currentPosition = this.localisation.getPosition();
    const orientation = this.localisation.getOrientation();
    
    // Calcul de la nouvelle position en fonction de l'orientation (direction opposée)
    let newPosition: Position = { ...currentPosition };
    
    switch (orientation.orientation) {
      case 'N':
        newPosition.y -= this.speed;
        break;
      case 'E':
        newPosition.x -= this.speed;
        break;
      case 'S':
        newPosition.y += this.speed;
        break;
      case 'W':
        newPosition.x += this.speed;
        break;
    }
    
    // Vérification de la présence d'obstacles
    const obstacleDetected = !this.obstacles.isPathClear(newPosition);
    
    // Si pas d'obstacle, mettre à jour la position
    if (!obstacleDetected) {
      this.localisation.updatePosition(newPosition);
    }
    
    this.moving = false;
    
    // Retourner l'état du rover
    return {
      position: this.localisation.getPosition(),
      orientation: this.localisation.getOrientation(),
      obstacleDetected
    };
  }

  turnLeft(): RoverState {
    const newOrientation = this.localisation.turnLeft();
    
    return {
      position: this.localisation.getPosition(),
      orientation: newOrientation,
      obstacleDetected: false
    };
  }

  turnRight(): RoverState {
    const newOrientation = this.localisation.turnRight();
    
    return {
      position: this.localisation.getPosition(),
      orientation: newOrientation,
      obstacleDetected: false
    };
  }
}
