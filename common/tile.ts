import { GameObject } from './gameObject.interface';
import { TILE_TYPES } from './tileType.constants';
export class Tile {
    type: TILE_TYPES;
    isOccupied: boolean;
    isObstacle: boolean;
    gameObject: GameObject;

    constructor(type: TILE_TYPES, isOccupied: boolean, isObstacle: boolean) {
        this.type = type;
        this.isOccupied = isOccupied;
        this.isObstacle = isObstacle;
    }
}
