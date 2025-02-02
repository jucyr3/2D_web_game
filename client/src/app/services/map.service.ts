import { Injectable } from '@angular/core';
import { ItemObject } from '@common/ItemObject';
import { Map } from '@common/map';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';
import * as htmlToImage from 'html-to-image';
import { ClientHttpRequestsService } from './client-http-requests.service';

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
}

@Injectable({
    providedIn: 'root',
})
export class MapService {
    map: Map;

    constructor(protected clientHttpRequest : ClientHttpRequestsService) {
        const mapJson = null;
        //const mapJson: MapJson = {"name":"Untitled","size":10,"isVisible":true,"description":"","gameMode":"Classic","tileMatrix":[[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"groundTile2","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"spawnpoint","description":"A magical marker that sets the player's respawn location."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"mushroom","description":"A small, red mushroom with white spots. Consuming it grants the player extra health, making it a valuable resource for survival."}},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":null},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"potion","description":"A magical elixir in a shimmering vial. Drinking it restores the player's health, making it essential for long journeys and tough battles."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"sword","description":"A sharp, gleaming sword forged from rare metals. It is the perfect weapon for close combat, allowing the player to defeat enemies with ease."}},{"type":"groundTile1","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"luma","description":"A glowing, celestial orb that radiates energy. It is said to hold mysterious powers, though its true purpose remains unknown."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"cloak","description":"A mystical cloak that grants the wearer the ability to become invisible for a short time. Perfect for sneaking past enemies or escaping danger."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"bomb","description":"A volatile explosive device. Use it wisely to clear obstacles or defeat groups of enemies, but be careful not to get caught in the blast!"}},{"type":"groundTile1","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"randomItem","description":"Becomes a random item upon starting the game."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"spawnpoint","description":"A magical marker that sets the player's respawn location."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false}],[{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"randomItem","description":"Becomes a random item upon starting the game."}},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false},{"type":"wallTile","isOccupied":false,"isObstacle":false,"gameObject":{"name":"flag","description":"A brightly colored flag."}},{"type":"groundTile1","isOccupied":false,"isObstacle":false},{"type":"groundTile1","isOccupied":false,"isObstacle":false}]],"lastModified":"2025-01-24T15:33:15.507Z"}
        if (!mapJson) {
            const mapSize = 20;
            this.map = new Map('Untitled', 0, mapSize, true, '', 'Classic');
        } else {
            //this.map = this.loadMapFromJSON(mapJson);
        }
    }

    // TODO change this garbage
    createEmptyMap(mapData: { name: string; gameMode: string; size: string }): void {
        this.map = new Map(mapData.name, 0, Number(mapData.size), true, '', mapData.gameMode as 'Classic' | 'CTF');
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
        return new Map(json.name, json.id, json.size, json.isVisible, json.description, json.gameMode, tileMatrix);
    }

    loadMap(map: Map): void {
        this.map = map;
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

        console.log(this.getMapJson());
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
                quality: 0.2,  // Reduce quality significantly
                width: mapRect.width * scaleFactor,
                height: mapRect.height * scaleFactor,
                pixelRatio: 0.5,
                skipAutoScale: true,
                style: {
                    transform: 'none'
                },
                // Add more aggressive compression options
                canvasWidth: mapRect.width * scaleFactor,
                canvasHeight: mapRect.height * scaleFactor,
                backgroundColor: '#fff'  // Set background to reduce transparency data
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
    
            this.clientHttpRequest.saveMapImageOnServer(this.map.id, base64String)
                .subscribe({
                    next: (updatedMap) => {
                        console.log('Map preview image saved successfully');
                    },
                    error: (error) => {
                        console.error('Error saving map preview image:', error);
                    }
                });
    
            // Create download with compressed version
            const response = await fetch(compressedDataUrl);
            const blob = await response.blob();
            
            // download image for testing
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `map-${this.map.id}-preview.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
    
            return blob;
        } catch (error) {
            console.error('Error exporting map as image:', error);
            return null;
        }
    }

    async saveMap() { // TODO : SHOULD CHANGE WHEN MERGING WITH VINCENT
        this.clientHttpRequest.saveMapToServer(this.map).subscribe({
            next: (savedMap) => {
                this.map = savedMap;
            },
            error: (error) => {
                console.error('Error saving map:', error);
            }
        });
        await this.exportMapAsImage(); // TODO : THERE IS A DELAY AFTER CLICKING ON THE BUTTON

    }
}
