import { InputService } from '../../ui/services/input.service';
import { MapService } from '../../ui/services/map.service';
import { MovementService } from '../../rover/services/movement.service';
import { ObstaclesService } from '../../rover/services/obstacles.service';
import { LocalisationService } from '../../rover/services/localisation.service';
import { RoverReturnService } from '../../ui/services/rover-return.service';
import { SendMessageService } from './send-message.service';
import { ReceiveMessageService } from './receive-message.service';
import { WebSocketService } from '../../network/services/websocket.service';
import { RoverState, Command } from '../../../common/common.interface';

export class MissionControlService {
  constructor(
    private inputService: InputService,
    private mapService: MapService,
    private movementService: MovementService,
    private obstaclesService: ObstaclesService,
    private localisationService: LocalisationService,
    private roverReturnService: RoverReturnService,
    private sendMessageService: SendMessageService,
    private receiveMessageService: ReceiveMessageService,
    private webSocketService: WebSocketService
  ) {}

  async start() {
    // Afficher la carte initiale
    const obstacles = this.obstaclesService.scanObstacles();
    this.mapService.updateMap(this.localisationService.getPosition(), obstacles, this.localisationService.getOrientation());
    this.mapService.displayMap();

    // Boucle principale d'exécution
    console.log('Rover is ready to receive commands!');
    console.log('Commands: Z (forward), S (backward), Q (left), D (right), scan, return');
    console.log('You can also enter command sequences like "ZDZZ" or "zzdzzz"');

    while (true) {
      // Capturer l'entrée utilisateur
      const input = await this.inputService.captureUserInput();
      const isSingleCommand = this.inputService.validateCommand(input.type);
      const commands = isSingleCommand 
        ? [input]  // Commande simple
        : this.inputService.parseCommands(input.type); // Séquence

      // Si c'est une séquence, montrer ce qui va être exécuté
      if (commands.length > 1) {
        console.log(`Executing command sequence: ${commands.map(c => c.type).join('')}`);
        await this.sendMessageService.sendCommandSequenceToRover(commands);
      } else {
        await this.sendMessageService.sendCommandToRover(commands[0]);
      }

      // Exécuter chaque commande localement
      for (const command of commands) {
        console.log(`Executing command: ${command.type}`);
        let state: RoverState | undefined;
        switch (command.type) {
          case 'Z':
            state = this.movementService.moveForward();
            console.log('Moving forward. New position:', state.position);
            break;
          case 'S':
            state = this.movementService.moveBackward();
            console.log('Moving backward. New position:', state.position);
            break;
          case 'Q':
            state = this.movementService.turnLeft();
            console.log('Turning left. New orientation:', state.orientation.orientation);
            break;
          case 'D':
            state = this.movementService.turnRight();
            console.log('Turning right. New orientation:', state.orientation.orientation);
            break;
          case 'scan':
            console.log('Scanning for obstacles...');
            const nearbyObstacles = this.obstaclesService.detectNearbyObstacles(5);
            console.log(`Detected ${nearbyObstacles.length} obstacles nearby`);
            break;
          case 'return':
            console.log('Terminating program...');
            this.inputService.close();
            this.webSocketService.disconnect();
            return;
        }
        // Mettre à jour la carte après chaque commande pour tracer le déplacement
        this.mapService.updateMap(this.localisationService.getPosition(), this.obstaclesService.scanObstacles(), this.localisationService.getOrientation());
        if (state && state.obstacleDetected) {
          console.log('⚠️ Obstacle detected! Cannot move in that direction.');
        }
      }
      // Afficher la carte seulement après avoir traité toutes les commandes
      this.mapService.displayMap();
    }
  }
} 