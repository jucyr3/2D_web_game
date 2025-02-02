import { Injectable } from '@angular/core';
import { ItemObject } from '@common/ItemObject';
import { Map } from '@common/map';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';

import { ItemManager } from '@app/classes/item-manager';

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
    lastModified: string;
}

@Injectable({
    providedIn: 'root',
})
export class MapService {
    map: Map;
    itemManager: ItemManager;

    constructor() {
        console.log("trying to load map from session storage");
        if (!this.loadMapFromSessionStorage()) {
            console.log("failed to load map from session storage");
            console.log("trying to load map from server");
            if (!this.loadMapFromServer()) {
                console.log("failed to load map from server");
                console.log("setting default map");
                this.setDefaultMap();
                this.saveMapToSessionStorage();
                this.itemManager = new ItemManager(this.map.size);
            }
        }
    }

    

    setDefaultMap(): void {
        const mapSize = 15;
        const defaultId = 0;
        this.map = new Map('Untitled', defaultId, mapSize, true, '', 'Classic');
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
        this.itemManager = new ItemManager(json.size);
        const tileMatrix = this.parseTileMatrix(json);
        return new Map(json.name, json.id, json.size, json.isVisible, json.description, json.gameMode, tileMatrix);
    }


    // returns true if map is loaded from server
    loadMapFromServer(): boolean {
        // TODO: for the server implementation
        // call the proper service to get the map from the server

        //this.createMapFromJSON(mapDuServeur);
        return false;
    }

    saveMapToServer(): void {
        // TODO: for the server implementation
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

    // for testing purposes
    // totally not AI generated
    printMap() {
        const abbreviateType = (type: string) => {
            return (
                type
                    .match(/(\b\w|[\d])/g)
                    ?.filter((c: string) => c.match(/[A-Z\d]/i))
                    .join('')
                    .toLowerCase() || ''
            );
        };

        const mapSize = this.map.size;

        const MIN_CELL_WIDTH = 5;
        const ABBREVIATION_LENGTH = 3;

        // 1. Calculate the maximum width needed for the content
        let maxCellWidth = 0;
        for (let i = 0; i < mapSize; i++) {
            for (let j = 0; j < mapSize; j++) {
                const tile = this.map.tileMatrix[i][j];
                const content = `${abbreviateType(tile.type)}${tile.gameObject ? ':' + tile.gameObject.name.slice(0, ABBREVIATION_LENGTH) : ''}`;
                maxCellWidth = Math.max(maxCellWidth, content.length);
            }
        }

        // 2. Define the cell width
        const CELL_WIDTH = Math.max(maxCellWidth + 2, MIN_CELL_WIDTH);

        // 3. Helper to center text
        const centerText = (text: string, width: number) => {
            const pad = width - text.length;
            const padLeft = Math.floor(pad / 2);
            const padRight = pad - padLeft;
            return ' '.repeat(padLeft) + text + ' '.repeat(padRight);
        };

        // 4. Calculate the width needed for row indices
        const rowIndexWidth = String(mapSize - 1).length; // Width of the largest row index

        // 5. Generate the centered header
        let header = ' '.repeat(rowIndexWidth + 2); // Padding for row indices
        for (let j = 0; j < mapSize; j++) {
            header += centerText(j.toString(), CELL_WIDTH);
        }

        // 6. Generate the rows
        const grid = [header];
        for (let i = 0; i < mapSize; i++) {
            // Pad the row index to ensure consistent width
            const rowIndex = String(i).padStart(rowIndexWidth, ' ');
            let row = `${rowIndex} |`;
            for (let j = 0; j < mapSize; j++) {
                const tile = this.map.tileMatrix[i][j];
                const typeAbbrev = abbreviateType(tile.type);
                const objAbbrev = tile.gameObject?.name.slice(0, ABBREVIATION_LENGTH) || '';
                const cellContent = `${typeAbbrev}${objAbbrev ? ':' + objAbbrev : ''}`;

                row += centerText(cellContent, CELL_WIDTH);
            }
            grid.push(row);
        }

        // 7. Print the grid
        console.log('\n' + grid.join('\n') + '\n');

        // console.log(this.getMapJson());
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
