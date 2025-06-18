"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementService = void 0;
class MovementService {
    constructor(localisation, obstacles) {
        this.localisation = localisation;
        this.obstacles = obstacles;
        this.speed = 1;
        this.moving = false;
    }
    moveForward() {
        this.moving = true;
        const currentPosition = this.localisation.getPosition();
        const orientation = this.localisation.getOrientation();
        // Calcul de la nouvelle position en fonction de l'orientation
        let newPosition = { ...currentPosition };
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
    moveBackward() {
        this.moving = true;
        const currentPosition = this.localisation.getPosition();
        const orientation = this.localisation.getOrientation();
        // Calcul de la nouvelle position en fonction de l'orientation (direction opposée)
        let newPosition = { ...currentPosition };
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
    getCurrentPosition() {
        return this.localisation.getPosition();
    }
    setSpeed(speed) {
        if (speed > 0) {
            this.speed = speed;
        }
    }
    getSpeed() {
        return this.speed;
    }
    stop() {
        this.moving = false;
    }
    isMoving() {
        return this.moving;
    }
    turnLeft() {
        const newOrientation = this.localisation.turnLeft();
        return {
            position: this.localisation.getPosition(),
            orientation: newOrientation,
            obstacleDetected: false
        };
    }
    turnRight() {
        const newOrientation = this.localisation.turnRight();
        return {
            position: this.localisation.getPosition(),
            orientation: newOrientation,
            obstacleDetected: false
        };
    }
}
exports.MovementService = MovementService;
