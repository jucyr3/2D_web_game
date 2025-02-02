import { ItemObject } from '@common/ItemObject';
import { Map } from '@common/map';
import { Tile } from '@common/Tile';
import { TileTypes } from '@common/tileType.constants';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';

interface MapJson {
    name: string;
    id: number;
    size: number;
    isVisible: boolean;
    description: string;
    gameMode: 'CTF' | 'Classic';
    tileMatrix: {
        type: string;
        isOccupied: boolean;
        isObstacle: boolean;
        gameObject?: {
            name: string;
            description: string;
        } | null;
    }[][];
    lastModified: Date;
    previewImage: string;
}

@Injectable()
export class MapService {
    private readonly logger = new Logger(MapService.name);
        private mapsFilePath = "assets/maps.json";
        private maps: Map[] | null = null; 
    
        async getAllMaps(): Promise<Map[]> {
            try {
                if (this.maps) {
                    return this.maps;
                }
                const data = await fs.readFile(this.mapsFilePath, 'utf8'); // reads json file on server
                const mapsData = JSON.parse(data).maps;
                this.maps = mapsData.map(map => this.loadMapFromJSON(map));
                return this.maps;
            } catch (error) {
                this.logger.error(`Failed to read maps: ${error.message}`, error.stack);
                throw new Error(`Failed to retrieve maps: ${error.message}`);
            }
        }
    
        async getAllMapsByVisibility(): Promise<Map[]> {
            try {
                if (this.maps) {
                    return this.maps;
                }
                const data = await fs.readFile(this.mapsFilePath, 'utf8');
                const mapsData = JSON.parse(data).maps;
                this.maps = mapsData.map(map => this.loadMapFromJSON(map));
                return this.maps.filter(map => map.isVisible === true);
            } catch (error) {
                this.logger.error(`Failed to get maps by visibility: ${error.message}`, error.stack);
                throw new Error(`Failed to retrieve maps by visibility: ${error.message}`);
            }
        }
    
        async getMapById(id: number): Promise<Map> {
            try {
                
                const map = this.maps.find(map => map.id === id);
                
                if (!map) {
                    throw new NotFoundException(`Map with ID ${id} not found`);
                }
                return map;
            } catch (error) {
                if (error instanceof NotFoundException) {
                    throw error;
                }
                this.logger.error(`Failed to find map: ${error.message}`, error.stack);
                throw new Error(`Failed to retrieve map: ${error.message}`);
            }
        }
    
        async saveMap(map: Map): Promise<Map> {
            try {
                const existingMapById = this.maps.find(m => m.id === map.id);
                
                if (existingMapById) { // si la map existe deja sur le serveur // on fait juste changer ses attributs
                    existingMapById.name = map.name;
                    existingMapById.description = map.description;
                    existingMapById.tileMatrix = map.tileMatrix;
                    existingMapById.previewImage = map.previewImage;
                    existingMapById.lastModified = new Date;
                    await this.saveMaps(this.maps);  // Save 
                    return existingMapById;
                
                } else { // sinon, on créé une nouvelle map
                    map.id = this.generateRandomId(); 
                    this.maps.push(map);
                    await this.saveMaps(this.maps);  // Save 
                    return map;
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
                const maps = await this.getAllMaps();
                const mapIndex = maps.findIndex(map => map.id === id);
                
                if (mapIndex === -1) {
                    throw new NotFoundException(`Map with ID ${id} not found`);
                }
                maps[mapIndex].isVisible = isVisible;
                await this.saveMaps(maps);
                return maps[mapIndex];
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
                const maps = await this.getAllMaps();
                const mapIndex = maps.findIndex(map => map.id === id);
                
                if (mapIndex === -1) {
                    throw new NotFoundException(`Map with ID ${id} not found`);
                }
                maps[mapIndex].previewImage = previewImage; // change previewImage
                await this.saveMaps(maps);
                return maps[mapIndex];
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
                const maps = await this.getAllMaps();
                const mapIndex = maps.findIndex(map => map.id === id);
                
                if (mapIndex === -1) {
                    throw new NotFoundException(`Map with ID ${id} not found`);
                }
                maps.splice(mapIndex, 1);
                await this.saveMaps(maps);
            } catch (error) {
                if (error instanceof NotFoundException) {
                    throw error;
                }
                this.logger.error(`Failed to delete map: ${error.message}`, error.stack);
                throw new Error(`Failed to delete map: ${error.message}`);
            }
        }
    
        private async saveMaps(maps: Map[]): Promise<void> {
            try {
                await fs.writeFile(
                    this.mapsFilePath,
                    JSON.stringify({ maps: maps }, null, 2),
                    'utf8'
                );
                this.maps = maps;
            } catch (error) {
                this.logger.error(`Failed to save games: ${error.message}`, error.stack);
                throw new Error(`Failed to save games to file: ${error.message}`);
            }
        }
    
        private generateRandomId(): number {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 10000);
            return parseInt(`${timestamp}${random}`);
        }
    
        parseTileMatrix(json: MapJson): Tile[][] {
            // eslint-disable-next-line
            return json.tileMatrix.map((row) =>
                row.map((tileData) => {
                    const type = tileData.type as TileTypes;
                    const isOccupied = tileData.isOccupied;
                    const isObstacle = tileData.isObstacle;
                    // TODO: Fix this
                    const gameObject = tileData.gameObject ? new ItemObject(tileData.gameObject.name, tileData.gameObject.description) : null;
    
                    return new Tile(type, isOccupied, isObstacle, gameObject);
                }),
            );
        }
    
        loadMapFromJSON(json: MapJson): Map {
            const tileMatrix = this.parseTileMatrix(json);
            return new Map(json.name, json.id, json.size, json.isVisible, json.description, json.gameMode, tileMatrix, json.previewImage, json.lastModified);
        }
}
