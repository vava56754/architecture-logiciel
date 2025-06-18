import { Message, Command } from '../../common/common.interface';

export interface ISendMessage {
  sendMessage(message: Message): Promise<boolean>;
  sendCommandToRover(command: Command): Promise<boolean>;
  sendCommandSequenceToRover(commands: Command[]): Promise<boolean>;
}