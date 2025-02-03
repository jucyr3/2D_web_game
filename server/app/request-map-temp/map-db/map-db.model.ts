import { Map } from '@common/map';
import * as mongoose from 'mongoose';

export const MapSchema = new mongoose.Schema({
    name: { type: String, required: true },
    map: { type: Map, required: true },
});
export interface MapBP {
    gameName: String;
    map: Map;
}
