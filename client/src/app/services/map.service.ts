import { Injectable } from '@angular/core';
import { ItemObject } from '@common/ItemObject';
import { Map } from '@common/map';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';

import { ItemManager } from '@app/classes/item-manager';
import { MapVerification } from '@common/mapVerification.interface';

export interface MapJson {
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
    lastModified: string;
}

@Injectable({
    providedIn: 'root',
})
export class MapService {
    map: Map;
    itemManager: ItemManager;
    errorList: string[] = [];

    constructor() {
        if (!this.loadMapFromSessionStorage()) {
            if (!this.loadMapFromServer()) {
                this.setDefaultMap();
                this.saveMapToSessionStorage();
                this.itemManager = new ItemManager(this.map.size, this.map.gameMode);
            }
        }
    }

    setDefaultMap(): void {
        const mapSize = 15;
        const defaultId = 0;
        this.map = {
            id: defaultId,
            name: 'Untitled',
            size: mapSize,
            isVisible: false,
            description: '',
            gameMode: 'Classic',
            tileMatrix: Array.from({ length: mapSize }, () => Array.from({ length: mapSize }, () => new Tile(TileTypes.GROUND_1, false, false))),
            lastModified: new Date(),
        };
    }

    parseTileMatrix(json: MapJson): Tile[][] {
        return json.tileMatrix.map((row) =>
            row.map((tileData) => {
                const type = tileData.type as TileTypes;
                const isOccupied = tileData.isOccupied;
                const isObstacle = tileData.isObstacle;
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
            tileMatrix,
            lastModified: new Date(json.lastModified),
        };
    }

    // returns true if map is loaded from server
    loadMapFromServer(): boolean {
        // TODO: for the server implementation
        // call the proper service to get the map from the server

        // this.createMapFromJSON(mapDuServeur);
        return false;
    }

    saveMapToServer(): void {
        // TODO: for the server implementation
        // temp object
        const mapVerification: MapVerification = {
            isUniqueName: false,
            isNamePresent: true,
            isDescriptionPresent: true,
            isMapHalfFloor: true,
            isMapAccessible: true,
            areStartingPointsValid: true,
            areDoorsNextToWalls: true,
            areDoorsNotNextToBorder: true,
        };
        this.handleMapVerificationError(mapVerification);
    }

    handleMapVerificationError(mapVerification: MapVerification): void {
        this.errorList = [];
        for (const key in mapVerification) {
            if (Object.prototype.hasOwnProperty.call(mapVerification, key)) {
                const typedKey = key as keyof MapVerification;
                if (!mapVerification[typedKey]) {
                    this.errorList.push(typedKey);
                }
            }
        }
    }

    flattenedTileMatrix(): Tile[] {
        return this.map.tileMatrix.reduce((acc, row) => [...acc, ...row], []);
    }

    saveMap(): void {
        this.saveMapToSessionStorage();
        this.saveMapToServer();
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
}
