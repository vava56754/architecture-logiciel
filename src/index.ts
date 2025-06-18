import { LocalisationService } from './modules/rover/services/localisation.service';
import { MapService } from './modules/ui/services/map.service';
import { InputService } from './modules/ui/services/input.service';
import { RoverReturnService } from './modules/ui/services/rover-return.service';
import { ObstaclesService } from './modules/rover/services/obstacles.service';
import { MovementService } from './modules/rover/services/movement.service';
import { WebSocketService } from './modules/network/services/websocket.service';
import { SendMessageService } from './modules/mission-control/services/send-message.service';
import { ReceiveMessageService } from './modules/mission-control/services/receive-message.service';
import { MissionControlService } from './modules/mission-control/services/mission-control.service';

async function main() {
  try {
    console.log('Initializing Rover Simulation System...');

    // Initialisation des services
    const obstaclesService = new ObstaclesService();
    const localisationService = new LocalisationService();
    const mapService = new MapService(obstaclesService);
    const movementService = new MovementService(localisationService, obstaclesService);
    const inputService = new InputService();
    const roverReturnService = new RoverReturnService();
    const webSocketService = new WebSocketService();
    const connected = await webSocketService.connect('ws://localhost:8080');
    if (!connected) {
      console.error('Failed to connect to WebSocket server');
      return;
    }
    const sendMessageService = new SendMessageService(webSocketService);
    const receiveMessageService = new ReceiveMessageService(webSocketService);
    receiveMessageService.startListening();
    receiveMessageService.onMessageReceived((message) => {
      roverReturnService.handleRoverResponse(message);
    });

    // Orchestration principale
    const missionControl = new MissionControlService(
      inputService,
      mapService,
      movementService,
      obstaclesService,
      localisationService,
      roverReturnService,
      sendMessageService,
      receiveMessageService,
      webSocketService
    );
    await missionControl.start();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main().catch(console.error);
