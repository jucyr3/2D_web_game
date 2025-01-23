import { GameObject } from './gameObject.interface';
import { TileTypes } from './tileType.constants';
export class Tile {
    type: TileTypes;
    isOccupied: boolean;
    isObstacle: boolean;
    gameObject: GameObject | null;

    constructor(type: TileTypes, isOccupied: boolean, isObstacle: boolean, gameObject?: GameObject) {
        this.type = type;
        this.isOccupied = isOccupied;
        this.isObstacle = isObstacle;
        if (gameObject) {
            this.gameObject = gameObject;
        }
    }
}
