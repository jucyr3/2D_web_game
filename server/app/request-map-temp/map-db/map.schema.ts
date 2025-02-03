import { TILE_TYPES } from '@common/tileType.constants';
import * as mongoose from 'mongoose';

const gameObjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const tileSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: Object.values(TILE_TYPES) },
    isOccupied: { type: Boolean, required: true },
    isObstacle: { type: Boolean, required: true },
    gameObject: { type: gameObjectSchema, required: false },
});

export const mapSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: Number, required: true },
    isVisible: { type: Boolean, required: true },
    description: { type: String, required: true },
    gameMode: { type: String, required: true, enum: ['CTF', 'Classic'] },
    lastModified: { type: Date, required: true },
    previewImage: { type: String, required: false },
    tileMatrix: [[tileSchema]],
});
