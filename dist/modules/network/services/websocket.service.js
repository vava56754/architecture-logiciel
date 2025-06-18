"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const ws_1 = __importDefault(require("ws"));
const events_1 = require("events");
class WebSocketService {
    constructor() {
        this.ws = null;
        this.events = new events_1.EventEmitter();
        this.connected = false;
        this.server = null;
    }
    async connect(url) {
        return new Promise((resolve) => {
            try {
                // Pour la simulation, nous créons un serveur WebSocket local
                if (!this.server) {
                    this.setupMockServer();
                }
                this.ws = new ws_1.default(url);
                this.ws.on('open', () => {
                    this.connected = true;
                    this.events.emit('connect');
                    resolve(true);
                });
                this.ws.on('message', (data) => {
                    this.events.emit('message', JSON.parse(data.toString()));
                });
                this.ws.on('close', () => {
                    this.connected = false;
                    this.events.emit('disconnect');
                });
                this.ws.on('error', (error) => {
                    console.error('WebSocket error:', error);
                    resolve(false);
                });
            }
            catch (error) {
                console.error('WebSocket connection error:', error);
                resolve(false);
            }
        });
    }
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.connected = false;
        }
    }
    async send(data) {
        if (!this.ws || !this.connected) {
            return false;
        }
        try {
            this.ws.send(JSON.stringify(data));
            return true;
        }
        catch (error) {
            console.error('Error sending data:', error);
            return false;
        }
    }
    onMessage(callback) {
        this.events.on('message', callback);
    }
    onConnect(callback) {
        this.events.on('connect', callback);
        if (this.connected) {
            callback();
        }
    }
    onDisconnect(callback) {
        this.events.on('disconnect', callback);
    }
    isConnected() {
        return this.connected;
    }
    // Méthode pour configurer un serveur WebSocket mock pour la simulation
    setupMockServer() {
        this.server = new ws_1.default.Server({ port: 8080 });
        this.server.on('connection', (socket) => {
            console.log('Mock server: client connected');
            socket.on('message', (message) => {
                console.log('Mock server received:', message.toString());
                // Simuler une réponse du rover
                const response = {
                    id: 'resp-' + Date.now(),
                    status: {
                        position: { x: 5, y: 5, z: 0 },
                        orientation: { orientation: 'N' },
                        battery: 85,
                        health: 'healthy',
                        mission: 'exploration',
                        lastUpdate: new Date(),
                        speed: 1,
                        sensors: {
                            camera: true,
                            lidar: true,
                            thermometer: true
                        }
                    }
                };
                setTimeout(() => {
                    socket.send(JSON.stringify(response));
                }, 500); // Simule un délai de 500ms
            });
        });
        console.log('Mock WebSocket server started on port 8080');
    }
}
exports.WebSocketService = WebSocketService;
