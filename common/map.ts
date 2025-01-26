import { Tile } from "./tile";
import { TileTypes } from "./tileType.constants";

export class Map {
    name: string;
    id:number;
    readonly size: number;
    isVisible: boolean;
    description: string;
    gameMode: "CTF" | "Classic";
    tileMatrix: Tile[][];
    lastModified: Date;
    previewImage: string;

    constructor(name: string, size: number, isVisible: boolean, description: string, gameMode: "CTF" | "Classic", lastModified: Date) {
        this.name = name;
        this.size = size;
        this.isVisible = isVisible;
        this.description = description;
        this.gameMode = gameMode;
        this.tileMatrix = Array.from({ length: size }, () => Array.from({ length: size }, () => new Tile(TileTypes.GROUND_1, false, false)));
        this.lastModified = lastModified;
    }

    get flattenedTileMatrix(): Tile[] {
        return this.tileMatrix.reduce((acc, row) => [...acc, ...row], []);
      }
}