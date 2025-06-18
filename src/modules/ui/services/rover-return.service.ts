import { IRoverReturn } from '../rover-return.interface';
import { RoverStatus } from '../../../common/common.interface';

export class RoverReturnService implements IRoverReturn {
  private roverStatus: RoverStatus | null = null;
  private connected: boolean = false;
  private lastResponseTime: Date | null = null;

  handleRoverResponse(response: any): void {
    this.lastResponseTime = new Date();
    this.connected = true;
    
    // Traiter la réponse et mettre à jour le statut si nécessaire
    if (response.status) {
      this.updateRoverStatus(response.status);
    }
    
    console.log('Rover response received:', response);
  }

  updateRoverStatus(status: RoverStatus): void {
    this.roverStatus = { ...status };
    console.log('Rover status updated:', this.roverStatus);
  }

  getRoverStatus(): RoverStatus | null {
    return this.roverStatus ? { ...this.roverStatus } : null;
  }

  isRoverConnected(): boolean {
    return this.connected;
  }

  getLastResponseTime(): Date | null {
    return this.lastResponseTime;
  }
}
