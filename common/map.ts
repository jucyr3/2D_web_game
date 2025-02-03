import { Tile } from './tile';
import { TILE_TYPES } from './tileType.constants';

export class Map {
    name: string;
    id: number;
    readonly size: number;
    isVisible: boolean;
    description: string;
    gameMode: 'CTF' | 'Classic';
    tileMatrix: Tile[][];
    lastModified: Date;
    previewImage: string;

    constructor(name: string, size: number, isVisible: boolean, description: string, gameMode: 'CTF' | 'Classic') {
        this.name = name;
        this.size = size;
        this.isVisible = isVisible;
        this.description = description;
        this.gameMode = gameMode;
        this.tileMatrix = Array.from({ length: size }, () => Array.from({ length: size }, () => new Tile(TILE_TYPES.GROUND_1, false, false)));
        this.lastModified = new Date();
    }

    get flattenedTileMatrix(): Tile[] {
        return this.tileMatrix.reduce((acc, row) => [...acc, ...row], []);
    }
}
