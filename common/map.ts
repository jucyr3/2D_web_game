import { Tile } from './tile';
import { TileTypes } from './tileType.constants';

export class Map {
    name: string;
    id: number;
    readonly size: number;
    isVisible: boolean;
    description: string;
    gameMode: 'CTF' | 'Classic';
    tileMatrix: Tile[][];
    lastModified: Date;

    constructor(name: string, id:number, size: number, isVisible: boolean, description: string, gameMode: 'CTF' | 'Classic', tileMatrix?: Tile[][]) {
        this.name = name;
        this.id = id;
        this.size = size;
        this.isVisible = isVisible;
        this.description = description;
        this.gameMode = gameMode;
        if (tileMatrix) {
            this.tileMatrix = tileMatrix;
        } else {
            this.tileMatrix = Array.from({ length: size }, () => Array.from({ length: size }, () => new Tile(TileTypes.GROUND_1, false, false)));
        }

        this.lastModified = new Date();
    }

    get flattenedTileMatrix(): Tile[] {
        return this.tileMatrix.reduce((acc, row) => [...acc, ...row], []);
    }
}
