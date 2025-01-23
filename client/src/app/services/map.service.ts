import { Injectable } from '@angular/core';
//import { GameObject } from '@common/gameObject.interface';
import { TileTypes } from '@common/tileType.constants';
import { Map } from '@common/map';
import { ItemObject } from '@common/ItemObject';

@Injectable({
    providedIn: 'root',
})
export class MapService {
    map: Map;

    constructor() {
        this.map = new Map('Untitled', 10, true, '', 'Classic');
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
    
        // 1. Calculate the maximum width needed for the content
        let maxCellWidth = 0;
        for (let i = 0; i < mapSize; i++) {
            for (let j = 0; j < mapSize; j++) {
                const tile = this.map.tileMatrix[i][j];
                const content = `${abbreviateType(tile.type)}${tile.gameObject ? ':' + tile.gameObject.name.slice(0, 3) : ''}`;
                maxCellWidth = Math.max(maxCellWidth, content.length);
            }
        }
    
        // 2. Define the cell width (minimum 5 characters)
        const CELL_WIDTH = Math.max(maxCellWidth + 2, 5);
    
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
                const objAbbrev = tile.gameObject?.name.slice(0, 3) || '';
                const cellContent = `${typeAbbrev}${objAbbrev ? ':' + objAbbrev : ''}`;
    
                row += centerText(cellContent, CELL_WIDTH);
            }
            grid.push(row);
        }
    
        // 7. Print the grid
        console.log('\n' + grid.join('\n') + '\n');
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

    removeGameObject(row: number, column: number): void {
        this.map.tileMatrix[row][column].gameObject = null;
    }
}
