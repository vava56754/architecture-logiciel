"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputService = void 0;
const uuid_1 = require("uuid");
const readline = __importStar(require("readline"));
class InputService {
    constructor() {
        this.inputHistory = [];
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    async captureUserInput() {
        return new Promise((resolve) => {
            this.rl.question('Enter command or sequence (Z,S,Q,D,scan,return): ', (input) => {
                // Si c'est une commande unique valide
                if (this.validateCommand(input)) {
                    const command = {
                        id: (0, uuid_1.v4)(),
                        type: input,
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
                        const sequenceCommand = {
                            id: (0, uuid_1.v4)(),
                            type: input.toUpperCase(), // Utiliser la séquence comme type
                            timestamp: new Date()
                        };
                        // Ajouter toutes les commandes de la séquence à l'historique
                        commands.forEach(cmd => this.inputHistory.push(cmd));
                        resolve(sequenceCommand);
                    }
                    else {
                        console.log('Invalid command. Please try again.');
                        resolve(this.captureUserInput());
                    }
                }
            });
        });
    }
    validateCommand(command) {
        return ['Z', 'S', 'Q', 'D', 'scan', 'return'].includes(command.toUpperCase());
    }
    parseCommands(input) {
        const commands = [];
        for (const char of input.toUpperCase()) {
            if (['Z', 'S', 'Q', 'D'].includes(char)) {
                const command = {
                    id: (0, uuid_1.v4)(),
                    type: char,
                    timestamp: new Date()
                };
                commands.push(command);
            }
        }
        return commands;
    }
    getInputHistory() {
        return [...this.inputHistory];
    }
    clearHistory() {
        this.inputHistory = [];
    }
    // Méthode pour fermer l'interface readline
    close() {
        this.rl.close();
    }
}
exports.InputService = InputService;
