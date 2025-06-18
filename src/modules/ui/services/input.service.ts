import { IInput } from '../input.interface';
import { Command } from '../../../common/common.interface';
import { v4 as uuidv4 } from 'uuid';
import * as readline from 'readline';

export class InputService implements IInput {
  private inputHistory: Command[] = [];
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async captureUserInput(): Promise<Command> {
    return new Promise((resolve) => {
      this.rl.question('Enter command or sequence (Z,S,Q,D,scan,return): ', (input) => {
        // Si c'est une commande unique valide
        if (this.validateCommand(input)) {
          const command: Command = {
            id: uuidv4(),
            type: input as any,
            timestamp: new Date()
          };
          
          this.inputHistory.push(command);
          resolve(command);
        } 
        // Si c'est une séquence de commandes
        else {
          const commands = this.parseCommands(input);
          if (commands.length > 0) {
            // Créer une commande spéciale qui contient la séquence
            const sequenceCommand: Command = {
              id: uuidv4(),
              type: input.toUpperCase() as any, // Utiliser la séquence comme type
              timestamp: new Date()
            };
            
            // Ajouter toutes les commandes de la séquence à l'historique
            commands.forEach(cmd => this.inputHistory.push(cmd));
            
            resolve(sequenceCommand);
          } else {
            console.log('Invalid command. Please try again.');
            resolve(this.captureUserInput());
          }
        }
      });
    });
  }

  validateCommand(command: string): boolean {
    return ['Z', 'S', 'Q', 'D', 'scan', 'return'].includes(command.toUpperCase());
  }

  parseCommands(input: string): Command[] {
    const commands: Command[] = [];
    
    for (const char of input.toUpperCase()) {
      if (['Z', 'S', 'Q', 'D'].includes(char)) {
        const command: Command = {
          id: uuidv4(),
          type: char as any,
          timestamp: new Date()
        };
        
        commands.push(command);
      }
    }
    
    return commands;
  }

  // Méthode pour fermer l'interface readline
  close(): void {
    this.rl.close();
  }
}
