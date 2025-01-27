import { Injectable } from '@angular/core';
import { ItemObject } from '@common/ItemObject';
import { Map } from '@common/map';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';

interface MapJson {
    name: string;
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

    constructor() {
        const mapJson = null;
        // const mapJson: MapJson = {"name":"Untitled","size":10,"isVisible":true,"description":"","gameMode":"Classic","tileMatrix":[[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"spawnpoint","description":"A magical marker that sets the player's respawn location."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"mushroom","description":"A small, red mushroom with white spots. Consuming it grants the player extra health, making it a valuable resource for survival."}},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":null},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"potion","description":"A magical elixir in a shimmering vial. Drinking it restores the player's health, making it essential for long journeys and tough battles."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"sword","description":"A sharp, gleaming sword forged from rare metals. It is the perfect weapon for close combat, allowing the player to defeat enemies with ease."}},{"type":"groundTile1","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"luma","description":"A glowing, celestial orb that radiates energy. It is said to hold mysterious powers, though its true purpose remains unknown."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"cloak","description":"A mystical cloak that grants the wearer the ability to become invisible for a short time. Perfect for sneaking past enemies or escaping danger."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"bomb","description":"A volatile explosive device. Use it wisely to clear obstacles or defeat groups of enemies, but be careful not to get caught in the blast!"}},{"type":"groundTile1","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"randomItem","description":"Becomes a random item upon starting the game."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"spawnpoint","description":"A magical marker that sets the player's respawn location."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"randomItem","description":"Becomes a random item upon starting the game."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"flag","description":"A brightly colored flag."}},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false}]],"lastModified":"2025-01-24T15:33:15.507Z"}
        if (!mapJson) {
            const mapSize = 20;
            this.map = new Map('Untitled', mapSize, true, '', 'Classic');
        } else {
            this.map = this.createMapFromJSON(mapJson);
        }
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

    createMapFromJSON(json: MapJson): Map {
        const tileMatrix = this.parseTileMatrix(json);
        return new Map(json.name, json.size, json.isVisible, json.description, json.gameMode, tileMatrix);
    }

    getMapJson(): string {
        return JSON.stringify(this.map);
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
        return this.map.tileMatrix[row][column].gameObject;
    }

    removeGameObject(row: number, column: number): void {
        this.map.tileMatrix[row][column].gameObject = null;
    }
}
