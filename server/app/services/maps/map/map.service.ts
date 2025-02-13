import { MapDbService } from '@app/model/map-db/map-db.service';
import { MapVerificationService } from '@app/services/mapVerification/mapVerification.service';
import { Map } from '@common/map';
import { MapResponse } from '@common/mapResponse';
import { MapVerification } from '@common/mapVerification.interface';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MapService {
    private readonly logger = new Logger(MapService.name);

    constructor(
        private mapVerificationService: MapVerificationService,
        private mapDbService: MapDbService,
    ) {}

    async getAllMaps(): Promise<Map[]> {
        try {
            const maps = await this.mapDbService.getAllMaps();
            const mapsParsed = maps.map((map) => this.transformToMap(map as Map));
            this.mapVerificationService.setAllMapsNames(mapsParsed);
            return mapsParsed;
        } catch (error) {
            throw new Error(`Failed to retrieve maps: ${error.message}`);
        }
    }

    async getAllMapsByVisibility(): Promise<Map[]> {
        try {
            const visibleMaps = await this.mapDbService.getVisible();
            const parsedVisibleMaps = visibleMaps.map((map) => this.transformToMap(map));
            return parsedVisibleMaps;
        } catch (error) {
            throw new Error(`Failed to retrieve maps by visibility: ${error.message}`);
        }
    }

    async getMapById(id: string): Promise<Map> {
        try {
            const foundMap = await this.mapDbService.getMap(id);
            if (!foundMap) {
                throw new NotFoundException(`Map with ID ${id} not found`);
            }
            return this.transformToMap(foundMap);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to retrieve map: ${error.message}`);
        }
    }

    async saveMap(map: Map): Promise<MapResponse> {
        try {
            const existingMaps = await this.mapDbService.getAllMaps();
            const parsedMaps = existingMaps.map((existingMap) => this.transformToMap(existingMap));
            const existingMapById = parsedMaps.find((m) => m.mapId === map.mapId);

            if (existingMapById) {
                this.mapVerificationService.removeMapName(existingMapById.name);
            }

            const verification = this.mapVerificationService.validateGame(map);
            const verificationResult = this.checkVerification(verification, existingMapById, map.mapId);

            if (verificationResult) {
                return verificationResult;
            }

            if (existingMapById) {
                return await this.updateExistingMap(existingMapById, map, verification);
            } else {
                return await this.createNewMap(map, verification);
            }
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to create map: ${error.message}`);
        }
    }

    async updateMapVisibility(id: string, isVisible: boolean): Promise<Map> {
        try {
            await this.mapDbService.changeMapVisibility(id, isVisible);
            const mapChanged = await this.getMapById(id);
            return this.transformToMap(mapChanged);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update map visibility: ${error.message}`);
        }
    }

    async updateMapImage(id: string, previewImage: string): Promise<boolean> {
        try {
            await this.mapDbService.saveImage(id, previewImage);
            return true;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update map image: ${error.message}`);
        }
    }

    async deleteMap(id: string): Promise<void> {
        try {
            await this.mapDbService.remove(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete map: ${error.message}`);
        }
    }

    private checkVerification(verification: MapVerification, existingMapById: Map | undefined, mapId: string): MapResponse | null {
        for (const [, value] of Object.entries(verification)) {
            if (!value && !existingMapById) {
                return {
                    id: '',
                    mapVerification: verification,
                } as MapResponse;
            }
            if (!value && existingMapById) {
                return {
                    id: mapId,
                    mapVerification: verification,
                } as MapResponse;
            }
        }
        return null;
    }

    private async updateExistingMap(existingMap: Map, map: Map, verification: MapVerification): Promise<MapResponse> {
        existingMap.name = map.name;
        existingMap.description = map.description;
        existingMap.tileMatrix = map.tileMatrix;
        existingMap.previewImage = map.previewImage;
        existingMap.lastModified = new Date();
        existingMap.mapId = map.mapId;

        await this.mapDbService.changeMap(existingMap.mapId, existingMap);

        return {
            id: map.mapId,
            mapVerification: verification,
        } as MapResponse;
    }

    private async createNewMap(map: Map, verification: MapVerification): Promise<MapResponse> {
        map.mapId = this.generateRandomId();
        await this.mapDbService.addMap(map);

        return {
            id: map.mapId,
            mapVerification: verification,
        } as MapResponse;
    }

    private generateRandomId(): string {
        return uuidv4();
    }

    private transformToMap(doc: Map): Map {
        return {
            mapId: doc.mapId,
            name: doc.name,
            size: doc.size,
            isVisible: doc.isVisible,
            description: doc.description,
            gameMode: doc.gameMode,
            tileMatrix: doc.tileMatrix,
            lastModified: doc.lastModified,
            previewImage: doc.previewImage,
        };
    }
}
