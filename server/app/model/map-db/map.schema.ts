import { TileTypes } from '@common/tileType.constants';
import * as mongoose from 'mongoose';

const itemObjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const tileSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: Object.values(TileTypes) },
    isOccupied: { type: Boolean, required: true },
    isObstacle: { type: Boolean, required: true },
    itemObject: { type: itemObjectSchema, required: false },
});

export const mapSchema = new mongoose.Schema({
    mapId: { type: Number, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    isVisible: { type: Boolean, required: true },
    description: { type: String, required: true },
    gameMode: { type: String, required: true, enum: ['CTF', 'Classic'] },
    lastModified: { type: Date, required: true },
    previewImage: { type: String, required: false },
    tileMatrix: [[tileSchema]],
});
