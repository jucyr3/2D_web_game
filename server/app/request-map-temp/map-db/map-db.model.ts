import { TILE_TYPES } from '@common/tileType.constants';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

const GameObjectSchema = new mongoose.Schema({
    id: { type: String, required: true }, // Assuming GameObject has an ID
    type: { type: String, required: true },
});

const TileSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: Object.values(TILE_TYPES) },
    isOccupied: { type: Boolean, required: true },
    isObstacle: { type: Boolean, required: true },
    gameObject: { type: GameObjectSchema, required: false }, // Optional GameObject
});

export const MapSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: Number, required: true },
    isVisible: { type: Boolean, required: true },
    description: { type: String, required: true },
    gameMode: { type: String, required: true, enum: ['CTF', 'Classic'] },
    lastModified: { type: Date, required: true },
    previewImage: { type: String, required: false },
    tileMatrix: [[TileSchema]],
});

export interface GameObject extends Document {
    id: string;
    type: string;
}

export interface Tile extends Document {
    type: string;
    isOccupied: boolean;
    isObstacle: boolean;
    gameObject?: GameObject;
}

export interface MapBP extends Document {
    name: string;
    size: number;
    isVisible: boolean;
    description: string;
    gameMode: 'CTF' | 'Classic';
    lastModified: Date;
    previewImage?: string;
    tileMatrix: Tile[][];
}
