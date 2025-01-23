import { GameObject } from './gameObject.interface';
import { TileTypes } from './tileType.constants';
export class Tile {
    type: TileTypes;
    isOccupied: boolean;
    isObstacle: boolean;
    gameObject: GameObject;

    constructor(type: TileTypes, isOccupied: boolean, isObstacle: boolean) {
        this.type = type;
        this.isOccupied = isOccupied;
        this.isObstacle = isObstacle;
    }
}
