import { ItemObject } from './ItemObject';
import { TileTypes } from './tileType.constants';
export interface Tile {
    type: TileTypes;
    isOccupied: boolean;
    isObstacle: boolean;
    itemObject: ItemObject | null;
}
