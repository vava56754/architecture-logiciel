import { ISendMessage } from '../send-message.interface';
import { Message, Command } from '../../../common/common.interface';
import { IWebSocket } from '../../network/websocket.interface';
import { v4 as uuidv4 } from 'uuid';

export class SendMessageService implements ISendMessage {
  private messageStatuses: Map<string, 'sent' | 'pending' | 'failed'> = new Map();
  private failedMessages: Message[] = [];

  constructor(private webSocketService: IWebSocket) {}

  async sendMessage(message: Message): Promise<boolean> {
    this.messageStatuses.set(message.id, 'pending');
    
    try {
      const success = await this.webSocketService.send(message);
      
      if (success) {
        this.messageStatuses.set(message.id, 'sent');
        console.log(`Message ${message.id} sent successfully`);
        return true;
      } else {
        this.messageStatuses.set(message.id, 'failed');
        this.failedMessages.push(message);
        console.error(`Failed to send message ${message.id}`);
        return false;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      this.messageStatuses.set(message.id, 'failed');
      this.failedMessages.push(message);
      return false;
    }
  }

  async sendCommandToRover(command: Command): Promise<boolean> {
    const message: Message = {
      id: uuidv4(),
      from: 'mission-control',
      to: 'rover',
      content: command,
      timestamp: new Date(),
      type: 'command'
    };
    
    return this.sendMessage(message);
  }

  async sendCommandSequenceToRover(commands: Command[]): Promise<boolean> {
    const message: Message = {
      id: uuidv4(),
      from: 'mission-control',
      to: 'rover',
      content: {
        type: 'sequence',
        commands: commands,
        sequenceId: uuidv4()
      },
      timestamp: new Date(),
      type: 'command'
    };
    
    return this.sendMessage(message);
  }
}
