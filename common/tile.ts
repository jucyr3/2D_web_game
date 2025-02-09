import { ItemObject } from '@common/ItemObject';
import { TileTypes } from '@common/tileType.constants';
export interface Tile {
    type: TileTypes;
    isOccupied: boolean;
    isObstacle: boolean;
    itemObject: ItemObject | null;
}
