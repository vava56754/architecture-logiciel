import { IMap } from '../map.interface';
import { Position, Obstacle, Orientation } from '../../../common/common.interface';
import { IObstacles } from '../../rover/obstacles.interface';

export class MapService implements IMap {
  private width: number = 20;
  private height: number = 20;
  private mapData: Record<string, any> = {};
  private obstacles: Set<string> = new Set();
  private roverOrientation: Orientation = { orientation: 'N' };

  constructor(private obstaclesService: IObstacles) {}

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  updateMap(position: Position, obstacles: Obstacle[], orientation?: Orientation): void {
    const posKey = `${position.x},${position.y}`;
    this.mapData[posKey] = { type: 'rover', position: { ...position } };
    
    // Mettre à jour l'orientation du rover si fournie
    if (orientation) {
      this.roverOrientation = orientation;
    }
    
    // Mise à jour des obstacles découverts uniquement
    for (const obstacle of obstacles) {
      if (this.obstaclesService.hasDiscoveredObstacle(obstacle.position.x, obstacle.position.y)) {
        const obstacleKey = `${obstacle.position.x},${obstacle.position.y}`;
        this.mapData[obstacleKey] = { type: 'obstacle', obstacle: { ...obstacle } };
        this.obstacles.add(obstacleKey);
      }
    }
  }

  getMapData(): any {
    return { ...this.mapData };
  }

  displayMap(): void {
    console.log('\n--- MAP DISPLAY ---');
    
    // Création d'une grille vide
    const grid: string[][] = [];
    for (let y = 0; y < this.height; y++) {
      grid[y] = [];
      for (let x = 0; x < this.width; x++) {
        grid[y][x] = '.';
      }
    }
    
    // Placement des éléments sur la grille
    for (const key in this.mapData) {
      const [x, y] = key.split(',').map(Number);
      
      // Ne dessiner que les éléments dans les limites de la grille
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        const item = this.mapData[key];
        
        if (item.type === 'rover') {
          // Afficher le rover avec son orientation
          const orientation = this.roverOrientation.orientation;
          grid[this.height - 1 - y][x] = orientation;
        } else if (item.type === 'obstacle') {
          const obstacleType = item.obstacle.type;
          switch (obstacleType) {
            case 'rock':
              grid[this.height - 1 - y][x] = '#';
              break;
            case 'crater':
              grid[this.height - 1 - y][x] = 'O';
              break;
            case 'debris':
              grid[this.height - 1 - y][x] = '*';
              break;
            default:
              grid[this.height - 1 - y][x] = 'X';
          }
        }
      }
    }
    
    // Affichage de la grille
    for (const row of grid) {
      console.log(row.join(' '));
    }
    console.log('--- END MAP ---\n');
  }

  isObstacle(x: number, y: number): boolean {
    return this.obstacles.has(`${x},${y}`);
  }

  getNextValidPosition(x: number, y: number, newX: number, newY: number): { x: number; y: number; obstacle: boolean } {
    // Si la nouvelle position a un obstacle, on retourne la position actuelle avec obstacle=true
    if (this.isObstacle(newX, newY)) {
      return { x, y, obstacle: true };
    }
    
    // Vérifier que la position est dans les limites de la carte
    const validX = Math.min(Math.max(newX, 0), this.width - 1);
    const validY = Math.min(Math.max(newY, 0), this.height - 1);
    
    // Retourner la position valide
    return { x: validX, y: validY, obstacle: false };
  }
}
