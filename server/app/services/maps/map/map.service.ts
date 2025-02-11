import { MapDbService } from '@app/model/map-db/map-db.service';
import { MapVerificationService } from '@app/services/mapVerification/mapVerification.service';
import { Map } from '@common/map';
import { MapResponse } from '@common/mapResponse';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';

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
            this.logger.error(`Failed to read maps: ${error.message}`, error.stack);
            throw new Error(`Failed to retrieve maps: ${error.message}`);
        }
    }

    async getAllMapsByVisibility(): Promise<Map[]> {
        try {
            const visibleMaps = await this.mapDbService.getVisible();
            const parsedVisibleMaps = visibleMaps.map((map) => this.transformToMap(map));
            return parsedVisibleMaps;
        } catch (error) {
            this.logger.error(`Failed to get maps by visibility: ${error.message}`, error.stack);
            throw new Error(`Failed to retrieve maps by visibility: ${error.message}`);
        }
    }

    async getMapById(id: number): Promise<Map> {
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
            this.logger.error(`Failed to find map: ${error.message}`, error.stack);
            throw new Error(`Failed to retrieve map: ${error.message}`);
        }
    }

    async saveMap(map: Map): Promise<MapResponse> {
        try {
            const existinMaps = await this.mapDbService.getAllMaps();
            const parsedMaps = existinMaps.map((existingMaps) => this.transformToMap(existingMaps));
            const existingMapById = parsedMaps.find((m) => m.mapId === map.mapId);
            if (existingMapById) {
                this.mapVerificationService.removeMapName(existingMapById.name);
            }
            const verification = this.mapVerificationService.validateGame(map);
            for (const [, value] of Object.entries(verification)) {
                if (!value && !existingMapById) {
                    return {
                        id: 0,
                        mapVerification: verification,
                    } as MapResponse;
                }
                if (!value && existingMapById) {
                    return {
                        id: map.mapId,
                        mapVerification: verification,
                    } as MapResponse;
                }
            }
            if (existingMapById) {
                existingMapById.name = map.name;
                existingMapById.description = map.description;
                existingMapById.tileMatrix = map.tileMatrix;
                existingMapById.previewImage = map.previewImage;
                existingMapById.lastModified = new Date();
                await this.mapDbService.changeMap(existingMapById.mapId, existingMapById);
                return {
                    id: map.mapId,
                    mapVerification: verification,
                } as MapResponse;
            } else {
                map.mapId = this.generateRandomId();
                await this.mapDbService.addMap(map);
                await this.mapDbService.saveImage(map.mapId, map.previewImage);
                return {
                    id: map.mapId,
                    mapVerification: verification,
                } as MapResponse;
            }
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Failed to create map: ${error.message}`, error.stack);
            throw new Error(`Failed to create map: ${error.message}`);
        }
    }

    async updateMapVisibility(id: number, isVisible: boolean): Promise<Map> {
        try {
            this.mapDbService.changeMapVisibility(id, isVisible);
            const mapChanged = await this.getMapById(id);
            return this.transformToMap(mapChanged);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to update map visibility: ${error.message}`, error.stack);
            throw new Error(`Failed to update map visibility: ${error.message}`);
        }
    }

    async updateMapImage(id: number, previewImage: string): Promise<Map> {
        try {
            await this.mapDbService.saveImage(id, previewImage);
            const mapUpdated = await this.mapDbService.getMap(id);
            return this.transformToMap(mapUpdated);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to update map image: ${error.message}`, error.stack);
            throw new Error(`Failed to update map image: ${error.message}`);
        }
    }

    async deleteMap(id: number): Promise<void> {
        try {
            this.mapDbService.remove(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to delete map: ${error.message}`, error.stack);
            throw new Error(`Failed to delete map: ${error.message}`);
        }
    }

    private generateRandomId(): number {
        const MAX_RANDOM_VALUE = 10000;
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * MAX_RANDOM_VALUE);
        return parseInt(`${timestamp}${random}`, 10);
    }

    private transformToMap(doc: Map): Map {
        return {
            mapId: doc.mapId,
            name: doc.name,
            size: doc.size,
            isVisible: doc.isVisible,
            description: doc.description,
            gameMode: doc.gameMode,
            tileMatrix: doc.tileMatrix || [[]],
            lastModified: doc.lastModified,
            previewImage: doc.previewImage,
        };
    }
}
