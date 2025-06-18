import { IObstacles } from '../obstacles.interface';
import { Position, Obstacle } from '../../../common/common.interface';

export class ObstaclesService implements IObstacles {
  private obstacles: Obstacle[] = [];
  private discoveredObstacles: Set<string> = new Set();

  constructor() {
    // Initialiser quelques obstacles pour la démonstration
    this.obstacles = [
      { position: { x: 5, y: 5, z: 0 }, type: 'rock', size: 2 },
      { position: { x: 10, y: 10, z: 0 }, type: 'crater', size: 3 },
      { position: { x: 15, y: 5, z: 0 }, type: 'debris', size: 1 },
      { position: { x: 7, y: 12, z: 0 }, type: 'rock', size: 2 },
      { position: { x: 3, y: 8, z: 0 }, type: 'debris', size: 1 },
    ];
  }

  scanObstacles(): Obstacle[] {
    // Retourner uniquement les obstacles découverts
    return this.obstacles
      .filter(obstacle => {
        const key = `${obstacle.position.x},${obstacle.position.y}`;
        return this.discoveredObstacles.has(key);
      })
      .map(obstacle => ({ ...obstacle, discovered: true }));
  }

  isPathClear(target: Position): boolean {
    // Vérifier si un obstacle existe à la position cible
    const obstacle = this.getObstacleAt(target);
    return obstacle === null;
  }

  getObstacleAt(position: Position): Obstacle | null {
    const obstacle = this.obstacles.find(obs => 
      obs.position.x === position.x && 
      obs.position.y === position.y
    );
    
    if (obstacle) {
      // Marquer comme découvert si trouvé
      this.discoverObstacle(position.x, position.y);
    }
    
    return obstacle || null;
  }

  detectNearbyObstacles(radius: number): Obstacle[] {
    // Simuler la détection des obstacles dans un rayon donné
    const detectedObstacles = this.obstacles.filter(obstacle => {
      const dx = obstacle.position.x;
      const dy = obstacle.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const isDetected = distance <= radius;
      
      // Marquer comme découvert si détecté
      if (isDetected) {
        this.discoverObstacle(obstacle.position.x, obstacle.position.y);
      }
      
      return isDetected;
    });
    
    return detectedObstacles.map(obstacle => ({ ...obstacle, discovered: true }));
  }

  discoverObstacle(x: number, y: number): void {
    const key = `${x},${y}`;
    this.discoveredObstacles.add(key);
  }

  hasDiscoveredObstacle(x: number, y: number): boolean {
    const key = `${x},${y}`;
    return this.discoveredObstacles.has(key);
  }
}
