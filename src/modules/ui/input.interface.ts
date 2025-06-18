import { Command } from '../../common/common.interface';

export interface IInput {
  captureUserInput(): Promise<Command>;
  validateCommand(command: string): boolean;
  parseCommands(input: string): Command[];
  close(): void;
}
