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

    async getAllMaps() {
        const response = await this.mapModel.find();
        return response;
    }

    async getMap(id: number) {
        let response;
        try {
            response = await this.mapModel.findOne({ mapId: id });
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

    async remove(id: number) {
        return await this.mapModel.deleteOne({ mapId: id });
    }

    async changeMap(id: number, map: Map) {
        const themap = await this.mapModel.updateOne({ mapId: id }, { $set: { ...map } });
        return themap;
    }
    async saveImage(id: number, image: string) {
        const themap = await this.mapModel.updateOne({ mapId: id }, { $set: { previewImage: image } });
        return themap;
    }
    async getImage(id: number) {
        const theImage = await this.mapModel.findById(id, { previewImage: 1, _id: 0 });
        return theImage.previewImage;
    }

    async changeMapVisibility(id: number, visible: boolean) {
        // TODO : TEST THIS THING
        const themap = await this.mapModel.updateOne({ mapId: id }, { $set: { isVisible: visible } });
        return themap;
    }
}
