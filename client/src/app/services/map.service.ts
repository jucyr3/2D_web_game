import { Injectable } from '@angular/core';
import { ItemObject } from '@common/ItemObject';
import { Map } from '@common/map';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';
import * as htmlToImage from 'html-to-image';
import { ClientHttpRequestsService } from './client-http-requests.service';

import { ItemManager } from '@app/classes/item-manager';

export interface MapJson {
    name: string;
    id: number;
    size: number;
    isVisible: boolean;
    description: string;
    gameMode: 'Classic' | 'CTF';
    tileMatrix: {
        type: string;
        isOccupied: boolean;
        isObstacle: boolean;
        gameObject?: {
            name: string;
        } | null;
    }[][];
    lastModified: Date;
}

@Injectable({
    providedIn: 'root',
})
export class MapService {
    map: Map;
    itemManager: ItemManager;

    constructor(protected clientHttpRequest: ClientHttpRequestsService) {
        if (!this.loadMapFromSessionStorage()) {
            this.setDefaultMap();
            this.saveMapToSessionStorage();
            this.itemManager = new ItemManager(this.map.size, this.map.gameMode);
        }
    }

    setDefaultMap(): void {
        const size = 15;
        const defaultMap: Map = {
            id: 0,
            name: 'Untitled',
            size: size,
            isVisible: true,
            description: '',
            gameMode: 'Classic',
            tileMatrix: Array.from({ length: size }, () => Array.from({ length: size }, () => new Tile(TileTypes.GROUND_1, false, false))),
            lastModified: new Date(),
            previewImage: ""
        };
        this.map = defaultMap;
    }

    createEmptyMap(mapData: { name: string; gameMode: 'Classic' | 'CTF'; size: string }): void {
        const size = Number(mapData.size);
        const defaultMap: Map = {
            id: 0,
            name: mapData.name,
            size: size,
            isVisible: false,
            description: '',
            gameMode: mapData.gameMode,
            tileMatrix: Array.from({ length: size }, () => Array.from({ length: size }, () => new Tile(TileTypes.GROUND_1, false, false))),
            lastModified: new Date(),
            previewImage: ""
        };
        this.map = defaultMap;
        this.itemManager = new ItemManager(size, mapData.gameMode);
     }

    parseTileMatrix(json: MapJson): Tile[][] {
        // eslint-disable-next-line
        return json.tileMatrix.map((row) =>
            row.map((tileData) => {
                const type = tileData.type as TileTypes;
                const isOccupied = tileData.isOccupied;
                const isObstacle = tileData.isObstacle;
                // TODO: Fix this
                const gameObject = tileData.gameObject ? new ItemObject(tileData.gameObject.name) : null;

                if (gameObject) {
                    this.itemManager.decreaseItemAmount(gameObject.name);
                }

                return new Tile(type, isOccupied, isObstacle, gameObject);
            }),
        );
    }

    createMapFromJSON(json: MapJson): Map {
        this.itemManager = new ItemManager(json.size, json.gameMode);
        const tileMatrix = this.parseTileMatrix(json);
        return {
            id: json.id,
            name: json.name,
            size: json.size,
            isVisible: json.isVisible,
            description: json.description,
            gameMode: json.gameMode,
            tileMatrix: tileMatrix,
            lastModified: new Date(),
            previewImage: ""
        };
     }

    loadMapFromServer(id: number): boolean {
        this.clientHttpRequest.loadMapById(id).subscribe({
            next: (map: Map) => {
                this.map = this.createMapFromJSON(map);
                this.saveMapToSessionStorage();
                return true;
            },
            error: (err) => {
                console.error('Error loading map:', err);
                return false;
            },
        });
        return false;
    }

    async saveMapToServer(): Promise<void> {
        this.clientHttpRequest.saveMapToServer(this.map).subscribe({
            next: (savedMap) => {
                this.map = savedMap;
            },
            error: (error) => {
                console.error('Error saving map:', error);
            },
        });

        await this.exportMapAsImage();
    }

    async saveMap(): Promise<void> {
        this.saveMapToSessionStorage();
        await this.saveMapToServer();
    }

    resetMap(): void {
        this.loadMapFromSessionStorage();
    }

    saveMapToSessionStorage(): void {
        sessionStorage.setItem('map', this.getMapJson());
    }

    loadMapFromSessionStorage(): boolean {
        const mapJson = sessionStorage.getItem('map');
        if (!mapJson) {
            return false;
        }
        this.map = this.createMapFromJSON(JSON.parse(mapJson));
        return true;
    }

    getMapJson(): string {
        return JSON.stringify(this.map);
    }

    getTileTexture(row: number, column: number): string {
        const tileType: TileTypes = this.getTileType(row, column);
        return `url(assets/tiles/${tileType}.png)`; // Use the tileType parameter
    }

    changeTileType(row: number, column: number, newType: TileTypes): void {
        this.map.tileMatrix[row][column].type = newType;
    }

    setDefaultTileType(row: number, column: number): void {
        this.map.tileMatrix[row][column].type = TileTypes.GROUND_1;
    }

    getTileType(row: number, column: number): TileTypes {
        return this.map.tileMatrix[row][column].type;
    }

    placeGameObject(row: number, column: number, gameObject: ItemObject): void {
        this.map.tileMatrix[row][column].gameObject = gameObject;
    }

    moveGameObject(row: number, column: number, newRow: number, newColumn: number): void {
        this.map.tileMatrix[newRow][newColumn].gameObject = this.map.tileMatrix[row][column].gameObject;
        this.map.tileMatrix[row][column].gameObject = null;
    }

    getItemObject(row: number, column: number): ItemObject | null {
        try {
            return this.map.tileMatrix[row][column].gameObject;
        } catch (error) {
            return null;
        }
    }

    removeGameObject(row: number, column: number): void {
        this.map.tileMatrix[row][column].gameObject = null;
    }

    resetItemToStartPosition(row: number, column: number, draggedItem: ItemObject): void {
        this.map.tileMatrix[row][column].gameObject = draggedItem;
    }

    async exportMapAsImage(): Promise<Blob | null> {
        const mapElement = document.querySelector('.map') as HTMLElement;

        if (!mapElement) {
            console.error('Map element not found');
            return null;
        }

        try {
            // Get dimensions but scale them down
            const mapRect = mapElement.getBoundingClientRect();
            const scaleFactor = 1.0; // Reduce to 50%

            const dataUrl = await htmlToImage.toPng(mapElement, {
                quality: 0.2, // Reduce quality significantly
                width: mapRect.width * scaleFactor,
                height: mapRect.height * scaleFactor,
                pixelRatio: 0.5,
                skipAutoScale: true,
                style: {
                    transform: 'none',
                },
                // Add more aggressive compression options
                canvasWidth: mapRect.width * scaleFactor,
                canvasHeight: mapRect.height * scaleFactor,
                backgroundColor: '#fff', // Set background to reduce transparency data
            });

            // Convert to JPEG for better compression (instead of PNG)
            const canvas = document.createElement('canvas');
            const img = new Image();

            await new Promise((resolve) => {
                img.onload = resolve;
                img.src = dataUrl;
            });

            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);

            // Get compressed JPEG data
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.3);
            const base64String = compressedDataUrl.split(',')[1];

            // Log size for debugging
            console.log('Image size (KB):', Math.round(base64String.length / 1024));

            this.clientHttpRequest.saveMapImageOnServer(this.map.id, base64String).subscribe({
                next: (updatedMap) => {
                    console.log('Map preview image saved successfully');
                },
                error: (error) => {
                    console.error('Error saving map preview image:', error);
                },
            });

            // Create download with compressed version
            const response = await fetch(compressedDataUrl);
            const blob = await response.blob();

            return blob;
        
        } catch (error) {
            console.error('Error exporting map as image:', error);
            return null;
        }
    }

    flattenedTileMatrix(): Tile[] {
        return this.map.tileMatrix.reduce((acc, row) => [...acc, ...row], []);
    }
}
