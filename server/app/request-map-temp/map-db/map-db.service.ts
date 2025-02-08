import { Map } from '@common/map';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MapDocument } from './map.interface';

@Injectable()
export class MapDbService {
    constructor(@InjectModel('Map') private readonly mapModel: Model<MapDocument>) {}

    async addMap(map: Map) {
        const response = await this.mapModel.create({ ...map, lastModified: new Date() });
        return response;
    }

    async getAllMap() {
        const response = await this.mapModel.find();
        return response;
    }

    async getMap(id: string) {
        let response;
        try {
            response = await this.mapModel.findById(id);
        } catch (error) {
            throw new NotFoundException('Map not found');
        }
        if (!response) {
            throw new NotFoundException('No map found');
        }
        return response;
    }
    async getVisible() {
        const response = await this.mapModel.find({ isVisible: true });
        return response ?? [];
    }

    async changeMap(id: string, map: Map) {
        const themap = await this.mapModel.updateOne({ _id: id }, { $set: { ...map } });
        return themap;
    }
    async remove(id: string) {
        return await this.mapModel.deleteOne({ _id: id });
    }
    async saveImage(id: string, image: string) {
        const themap = await this.mapModel.updateOne({ _id: id }, { $set: { previewImage: image } });
        return themap;
    }
    async getImage(id: string) {
        const theImage = await this.mapModel.findById(id, { previewImage: 1, _id: 0 });
        return theImage.previewImage;
    }
}
