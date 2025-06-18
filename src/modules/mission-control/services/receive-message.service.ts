import { IReceiveMessage } from '../receive-message.interface';
import { Message } from '../../../common/common.interface';
import { IWebSocket } from '../../network/websocket.interface';
import { EventEmitter } from 'events';

export class ReceiveMessageService implements IReceiveMessage {
  private messageCallbacks: ((message: Message) => void)[] = [];
  private listening: boolean = false;
  private events: EventEmitter = new EventEmitter();

  constructor(private webSocketService: IWebSocket) {}

  async receiveMessage(): Promise<Message> {
    return new Promise((resolve) => {
      const handler = (message: Message) => {
        this.events.removeListener('message', handler);
        resolve(message);
      };
      
      this.events.once('message', handler);
    });
  }

  onMessageReceived(callback: (message: Message) => void): void {
    this.messageCallbacks.push(callback);
  }

  startListening(port?: number): void {
    if (this.listening) {
      return;
    }
    
    this.listening = true;
    
    // Configurer l'écoute des messages via WebSocket
    this.webSocketService.onMessage((data) => {
      const message = data as Message;
      
      // Notifier tous les callbacks
      this.messageCallbacks.forEach(callback => {
        callback(message);
      });
      
      // Émettre l'événement message
      this.events.emit('message', message);
    });
    
    console.log('Started listening for messages');
  }

  stopListening(): void {
    this.listening = false;
    console.log('Stopped listening for messages');
  }

  isListening(): boolean {
    return this.listening;
  }

  broadcastMessage(message: any): void {
    // Créer un message de type broadcast
    const broadcastMsg: Message = {
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
