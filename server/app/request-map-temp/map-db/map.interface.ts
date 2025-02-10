import { Document } from 'mongoose';

export interface ItemObject extends Document {
    id: string;
    type: string;
}

export interface TileDocument extends Document {
    type: string;
    isOccupied: boolean;
    isObstacle: boolean;
    gameObject?: ItemObject;
}

export interface MapDocument extends Document {
    name: string;
    size: number;
    isVisible: boolean;
    description: string;
    gameMode: 'CTF' | 'CLASSIC';
    lastModified: Date;
    previewImage?: string;
    tileMatrix: TileDocument[][];
}
