import { ItemObject } from '@common/ItemObject';
import { Map } from '@common/map';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';
import { Document } from 'mongoose';

export interface TileDocument extends Tile {
    type: TileTypes;
    isOccupied: boolean;
    isObstacle: boolean;
    itemObject: ItemObject | null;
}

export interface MapDocument extends Map, Document {}
