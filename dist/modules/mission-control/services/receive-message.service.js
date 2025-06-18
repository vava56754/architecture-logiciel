"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveMessageService = void 0;
const events_1 = require("events");
class ReceiveMessageService {
    constructor(webSocketService) {
        this.webSocketService = webSocketService;
        this.messageCallbacks = [];
        this.listening = false;
        this.events = new events_1.EventEmitter();
    }
    async receiveMessage() {
        return new Promise((resolve) => {
            const handler = (message) => {
                this.events.removeListener('message', handler);
                resolve(message);
            };
            this.events.once('message', handler);
        });
    }
    onMessageReceived(callback) {
        this.messageCallbacks.push(callback);
    }
    startListening(port) {
        if (this.listening) {
            return;
        }
        this.listening = true;
        // Configurer l'écoute des messages via WebSocket
        this.webSocketService.onMessage((data) => {
            const message = data;
            // Notifier tous les callbacks
            this.messageCallbacks.forEach(callback => {
                callback(message);
            });
            // Émettre l'événement message
            this.events.emit('message', message);
        });
        console.log('Started listening for messages');
    }
    stopListening() {
        this.listening = false;
        console.log('Stopped listening for messages');
    }
    isListening() {
        return this.listening;
    }
    broadcastMessage(message) {
        // Créer un message de type broadcast
        const broadcastMsg = {
            id: Date.now().toString(),
            from: 'mission-control',
            to: 'broadcast',
            content: message,
            timestamp: new Date(),
            type: 'data'
        };
        // Émettre l'événement pour que tous les abonnés le reçoivent
        this.events.emit('message', broadcastMsg);
        console.log('Broadcast message sent:', broadcastMsg);
    }
}
exports.ReceiveMessageService = ReceiveMessageService;
