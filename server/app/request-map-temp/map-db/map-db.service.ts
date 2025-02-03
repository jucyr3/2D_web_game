import { Map } from '@common/map';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MapBP } from './map-db.model';

@Injectable()
export class MapDbService {
    constructor(@InjectModel('Map') private readonly mapModel: Model<MapBP>) {}

    async addMap(name: String, map: Map) {
        const addedMap = new this.mapModel({
            name,
            map,
        });
        const response = await addedMap.save();
        return response;
    }

    async getAllMap() {
        const response = await this.mapModel.find().exec();
        return response;
    }

    async getMap(id: string) {
        let response;
        try {
            response = await this.mapModel.findById(id).exec();
        } catch (error) {
            throw new NotFoundException('Map not found');
        }
        if (!response) {
            throw new NotFoundException('No map found');
        }
        return response;
    }
    async getVisible() {
        let response = await this.mapModel.find({ 'map.isVisible': true }).exec();
        return response ?? [];
    }

    async changeMap(id: string, name: string, map: Object) {
        const themap = await this.getMap(id);
        if (name) {
            themap.name = name;
        }
        if (map) {
            themap.map = map;
        }
        themap.save();
    }
    async remove(id: string) {
        return await this.mapModel.deleteOne({ _id: id }).exec();
    }
}
