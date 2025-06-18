import { IWebSocket } from '../websocket.interface';
import WebSocket from 'ws';
import { EventEmitter } from 'events';

export class WebSocketService implements IWebSocket {
  private ws: WebSocket | null = null;
  private events: EventEmitter = new EventEmitter();
  private connected: boolean = false;
  private server: WebSocket.Server | null = null;
  private serverPort: number = 8080;

  async connect(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        // Pour la simulation, nous créons un serveur WebSocket local
        if (!this.server) {
          this.setupMockServer();
        }
        
        this.ws = new WebSocket(url);
        
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
      } catch (error) {
        console.error('WebSocket connection error:', error);
        resolve(false);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
    }
    
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }

  async send(data: any): Promise<boolean> {
    if (!this.ws || !this.connected) {
      return false;
    }
    
    try {
      this.ws.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error sending data:', error);
      return false;
    }
  }

  onMessage(callback: (data: any) => void): void {
    this.events.on('message', callback);
  }

  onConnect(callback: () => void): void {
    this.events.on('connect', callback);
    
    if (this.connected) {
      callback();
    }
  }

  onDisconnect(callback: () => void): void {
    this.events.on('disconnect', callback);
  }

  isConnected(): boolean {
    return this.connected;
  }

  // Méthode pour configurer un serveur WebSocket mock pour la simulation
  private setupMockServer(): void {
    const tryPort = (port: number): Promise<number> => {
      return new Promise((resolve, reject) => {
        const server = new WebSocket.Server({ port }, () => {
          this.server = server;
          this.serverPort = port;
          resolve(port);
        });
        
        server.on('error', (error: any) => {
          if (error.code === 'EADDRINUSE') {
            // Essayer le port suivant
            server.close();
            resolve(tryPort(port + 1));
          } else {
            reject(error);
          }
        });
      });
    };

    tryPort(this.serverPort).then((port) => {
      console.log(`Mock WebSocket server started on port ${port}`);
      
      this.server!.on('connection', (socket) => {
        console.log('Mock server: client connected');
        
        socket.on('message', (message) => {
          console.log('Mock server received:', message.toString());
          
          const data = JSON.parse(message.toString());
          
          // Vérifier si c'est une séquence de commandes
          if (data.content && data.content.type === 'sequence') {
            console.log(`Mock server: Received command sequence with ${data.content.commands.length} commands`);
            console.log('Commands in sequence:', data.content.commands.map((cmd: any) => cmd.type).join(''));
          } else {
            console.log('Mock server: Received single command:', data.content?.type);
          }
          
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
            },
            sequenceId: data.content?.sequenceId || null
          };
          
          setTimeout(() => {
            socket.send(JSON.stringify(response));
          }, 500); // Simule un délai de 500ms
        });
      });
    }).catch((error) => {
      console.error('Failed to start mock server:', error);
    });
  }
}
