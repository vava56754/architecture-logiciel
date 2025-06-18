"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalisationService = void 0;
class LocalisationService {
    constructor() {
        this.position = { x: 0, y: 0, z: 0 };
        this.orientation = { orientation: 'N' };
    }
    updatePosition(position) {
        this.position = { ...position };
    }
    getPosition() {
        return { ...this.position };
    }
    getOrientation() {
        return { ...this.orientation };
    }
    setOrientation(orientation) {
        this.orientation = { ...orientation };
    }
    turnLeft() {
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
    turnRight() {
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
exports.LocalisationService = LocalisationService;
