"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoverReturnService = void 0;
class RoverReturnService {
    constructor() {
        this.roverStatus = null;
        this.connected = false;
        this.lastResponseTime = null;
    }
    handleRoverResponse(response) {
        this.lastResponseTime = new Date();
        this.connected = true;
        // Traiter la réponse et mettre à jour le statut si nécessaire
        if (response.status) {
            this.updateRoverStatus(response.status);
        }
        console.log('Rover response received:', response);
    }
    updateRoverStatus(status) {
        this.roverStatus = { ...status };
        console.log('Rover status updated:', this.roverStatus);
    }
    getRoverStatus() {
        return this.roverStatus ? { ...this.roverStatus } : null;
    }
    isRoverConnected() {
        return this.connected;
    }
    getLastResponseTime() {
        return this.lastResponseTime;
    }
}
exports.RoverReturnService = RoverReturnService;
