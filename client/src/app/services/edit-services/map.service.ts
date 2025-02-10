import { Injectable } from '@angular/core';
import { ItemObject } from '@common/ItemObject';
import { Map } from '@common/map';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';
import html2canvas from 'html2canvas';
import { ClientHttpRequestsService } from '@app/services/client-http-requests.service';
import { ItemManager } from '@app/classes/item-manager';
import { MapVerification } from '@common/mapVerification.interface';
import { Router } from '@angular/router';
import { MapFormData } from '@app/interfaces/mapFormData';
import { MapProperties } from '@common/map.constants';

@Injectable({
    providedIn: 'root',
})
export class MapService {
    map: Map;
    itemManager: ItemManager;
    errorList: string[] = [];

    constructor(
        protected clientHttpRequest: ClientHttpRequestsService,
        private router: Router,
    ) {
        if (!this.loadMapFromSessionStorage()) {
            this.setDefaultMap();
            this.saveMapToSessionStorage();
            this.itemManager = new ItemManager(this.map.size, this.map.gameMode);
        }
    }

    setDefaultMap(): void {
        const mapSize = MapProperties.MAP_SIZE_MEDIUM;
        const defaultId = 0;
        this.map = {
            mapId: defaultId,
            name: 'Untitled',
            size: mapSize,
            isVisible: false,
            description: '',
            gameMode: 'Classic',
            tileMatrix: Array.from({ length: mapSize }, () =>
                Array.from({ length: mapSize }, () => ({ type: TileTypes.GROUND_1, isOccupied: false, isObstacle: false, itemObject: null }) as Tile),
            ),
            lastModified: new Date(),
        };
    }

    createEmptyMap(mapData: MapFormData): void {
        const defaultMap: Map = {
            mapId: 0,
            name: 'Untitled',
            size: mapData.size,
            isVisible: false,
            description: '',
            gameMode: mapData.gameMode,
            tileMatrix: Array.from({ length: mapData.size }, () =>
                Array.from(
                    { length: mapData.size },
                    () => ({ type: TileTypes.GROUND_1, isOccupied: false, isObstacle: false, itemObject: null }) as Tile,
                ),
            ),
            lastModified: new Date(),
            previewImage: '',
        };
        this.map = defaultMap;
        this.itemManager = new ItemManager(mapData.size, mapData.gameMode);
    }

    parseTileMatrix(json: Map): Tile[][] {
        return json.tileMatrix.map((row) =>
            row.map((tileData) => {
                const type: TileTypes = tileData.type;
                const isOccupied = tileData.isOccupied;
                const isObstacle = tileData.isObstacle;
                const itemObject: ItemObject | null = tileData.itemObject ? { name: tileData.itemObject.name } : null;

                if (itemObject) {
                    this.itemManager.decreaseItemAmount(itemObject.name);
                }

                return { type, isOccupied, isObstacle, itemObject } as Tile;
            }),
        );
    }

    createMapFromJSON(json: Map): Map {
        this.itemManager = new ItemManager(json.size, json.gameMode);
        const tileMatrix = this.parseTileMatrix(json);
        return {
            mapId: json.mapId,
            name: json.name,
            size: json.size,
            isVisible: json.isVisible,
            description: json.description,
            gameMode: json.gameMode,
            tileMatrix,
            lastModified: new Date(json.lastModified),
        };
    }

    async loadMapFromServer(id: number): Promise<boolean> {
        return new Promise((resolve) => {
            this.errorList = [];
            this.clientHttpRequest.loadMapById(id).subscribe({
                next: (map: Map) => {
                    this.map = this.createMapFromJSON(map);
                    this.saveMapToSessionStorage();
                    resolve(true);
                },
            });
        });
    }

    async saveMapToServer(): Promise<MapVerification> {
        return new Promise((resolve) => {
            this.clientHttpRequest.saveMapToServer(this.map).subscribe({
                next: (mapResponse) => {
                    this.map.mapId = mapResponse.id;
                    resolve(mapResponse.mapVerification);
                },
            });
        });
    }

    handleMapVerificationError(mapVerification: MapVerification): void {
        this.errorList = [];
        for (const [key, value] of Object.entries(mapVerification)) {
            if (!value) {
                this.errorList.push(key as keyof MapVerification);
            }
        }
    }

    async saveMap(): Promise<void> {
        this.saveMapToSessionStorage();
        const mapVerification = await this.saveMapToServer();
        this.handleMapVerificationError(mapVerification);

        if (this.errorList.length === 0) {
            await this.exportMapAsImage();
            this.errorList = [];
            this.router.navigate(['/admin']);
        }
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
        return `url(assets/tiles/${tileType}.png)`;
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
        this.map.tileMatrix[row][column].itemObject = gameObject;
    }

    moveGameObject(row: number, column: number, newRow: number, newColumn: number): void {
        this.map.tileMatrix[newRow][newColumn].itemObject = this.map.tileMatrix[row][column].itemObject;
        this.map.tileMatrix[row][column].itemObject = null;
    }

    getItemObject(row: number, column: number): ItemObject | null {
        try {
            return this.map.tileMatrix[row][column].itemObject;
        } catch (error) {
            return null;
        }
    }

    removeGameObject(row: number, column: number): void {
        this.map.tileMatrix[row][column].itemObject = null;
    }

    resetItemToStartPosition(row: number, column: number, draggedItem: ItemObject): void {
        this.map.tileMatrix[row][column].itemObject = draggedItem;
    }

    async exportMapAsImage(): Promise<Blob | null> {
        const mapElement = document.querySelector('.map') as HTMLElement;

        if (!mapElement) {
            throw new Error('Map element not found');
        }

        try {
            // Use html2canvas to render the .map element to a canvas
            const canvas = await html2canvas(mapElement, {
                scale: 1,
                useCORS: true,
                backgroundColor: 'transparent',
            });

            const compressedScale = 0.3;
            const compressedDataUrl = canvas.toDataURL('image/jpeg', compressedScale);

            const base64String = compressedDataUrl.split(',')[1];

            this.clientHttpRequest.saveMapImageOnServer(this.map.mapId, base64String).subscribe({});

            // Convert the base64 image to a Blob and return it
            const response = await fetch(compressedDataUrl);
            return response.blob();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Error exporting map as image: ${errorMessage}`);
        }
    }

    flattenedTileMatrix(): Tile[] {
        return this.map.tileMatrix.reduce((acc, row) => [...acc, ...row], []);
    }
}
