import { ItemObject } from './ItemObject';
import { TileTypes } from './tileType.constants';
export class Tile {
    type: TileTypes;
    isOccupied: boolean;
    isObstacle: boolean;
    gameObject: ItemObject | null;

    constructor(type: TileTypes, isOccupied: boolean, isObstacle: boolean, gameObject: ItemObject | null = null) {
        this.type = type;
        this.isOccupied = isOccupied;
        this.isObstacle = isObstacle;
        if (gameObject) {
            this.gameObject = gameObject;
        }
    }
}
