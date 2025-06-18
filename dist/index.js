"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const localisation_service_1 = require("./modules/rover/services/localisation.service");
const map_service_1 = require("./modules/ui/services/map.service");
const input_service_1 = require("./modules/ui/services/input.service");
const rover_return_service_1 = require("./modules/ui/services/rover-return.service");
const obstacles_service_1 = require("./modules/rover/services/obstacles.service");
const movement_service_1 = require("./modules/rover/services/movement.service");
const websocket_service_1 = require("./modules/network/services/websocket.service");
const send_message_service_1 = require("./modules/mission-control/services/send-message.service");
const receive_message_service_1 = require("./modules/mission-control/services/receive-message.service");
async function main() {
    try {
        console.log('Initializing Rover Simulation System...');
        // Initialisation des services
        const obstaclesService = new obstacles_service_1.ObstaclesService();
        const localisationService = new localisation_service_1.LocalisationService();
        const mapService = new map_service_1.MapService(obstaclesService);
        const movementService = new movement_service_1.MovementService(localisationService, obstaclesService);
        const inputService = new input_service_1.InputService();
        const roverReturnService = new rover_return_service_1.RoverReturnService();
        // Configuration de la position initiale
        localisationService.updatePosition({ x: 0, y: 0, z: 0 });
        // Configuration WebSocket
        const webSocketService = new websocket_service_1.WebSocketService();
        const connected = await webSocketService.connect('ws://localhost:8080');
        if (!connected) {
            console.error('Failed to connect to WebSocket server');
            return;
        }
        console.log('Connected to WebSocket server');
        // Services de communication
        const sendMessageService = new send_message_service_1.SendMessageService(webSocketService);
        const receiveMessageService = new receive_message_service_1.ReceiveMessageService(webSocketService);
        // Démarrer l'écoute des messages
        receiveMessageService.startListening();
        // Callback de réception des messages
        receiveMessageService.onMessageReceived((message) => {
            console.log('Message received:', message);
            roverReturnService.handleRoverResponse(message);
        });
        // Afficher la carte initiale
        const obstacles = obstaclesService.scanObstacles();
        mapService.updateMap(localisationService.getPosition(), obstacles, localisationService.getOrientation());
        mapService.displayMap();
        // Boucle principale d'exécution
        console.log('Rover is ready to receive commands!');
        console.log('Commands: Z (forward), S (backward), Q (left), D (right), scan, return');
        console.log('You can also enter command sequences like "ZDZZ" or "zzdzzz"');
        while (true) {
            // Capturer l'entrée utilisateur
            const input = await inputService.captureUserInput();
            // Vérifier si c'est une commande simple ou une séquence
            const isSingleCommand = inputService.validateCommand(input.type);
            const commands = isSingleCommand
                ? [input] // Commande simple
                : inputService.parseCommands(input.type); // Séquence
            // Si c'est une séquence, montrer ce qui va être exécuté
            if (commands.length > 1) {
                console.log(`Executing command sequence: ${commands.map(c => c.type).join('')}`);
            }
            // Exécuter chaque commande
            for (const command of commands) {
                console.log(`Executing command: ${command.type}`);
                // Initialiser state comme undefined pour éviter l'erreur TS2454
                let state;
                // Exécuter la commande
                switch (command.type) {
                    case 'Z':
                        state = movementService.moveForward();
                        console.log('Moving forward. New position:', state.position);
                        break;
                    case 'S':
                        state = movementService.moveBackward();
                        console.log('Moving backward. New position:', state.position);
                        break;
                    case 'Q':
                        state = movementService.turnLeft();
                        console.log('Turning left. New orientation:', state.orientation.orientation);
                        break;
                    case 'D':
                        state = movementService.turnRight();
                        console.log('Turning right. New orientation:', state.orientation.orientation);
                        break;
                    case 'scan':
                        console.log('Scanning for obstacles...');
                        const nearbyObstacles = obstaclesService.detectNearbyObstacles(5);
                        console.log(`Detected ${nearbyObstacles.length} obstacles nearby`);
                        break;
                    case 'return':
                        console.log('Terminating program...');
                        inputService.close();
                        webSocketService.disconnect();
                        return;
                }
                // Envoyer la commande au rover via WebSocket
                await sendMessageService.sendCommandToRover(command);
                // Mettre à jour la carte après chaque commande
                mapService.updateMap(localisationService.getPosition(), obstaclesService.scanObstacles(), localisationService.getOrientation());
                mapService.displayMap();
                // Vérifier si state a été défini avant d'accéder à sa propriété
                if (state && state.obstacleDetected) {
                    console.log('⚠️ Obstacle detected! Cannot move in that direction.');
                }
            }
        }
    }
    catch (error) {
        console.error('An error occurred:', error);
    }
}
// Démarrer l'application
main().catch(console.error);
