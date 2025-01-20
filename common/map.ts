import { Tile } from "./tile";

export class Map {
    name: string;
    readonly size: number;
    isVisible: boolean;
    description: string;
    gameMode: "CTF" | "Classic";
    tileMatrix: Tile[][];
    lastModified: Date;

    constructor(name: string, size: number, isVisible: boolean, description: string, gameMode: "CTF" | "Classic") {
        this.name = name;
        this.size = size;
        this.isVisible = isVisible;
        this.description = description;
        this.gameMode = gameMode;
        this.tileMatrix = Array.from({ length: size }, () => Array.from({ length: size }, () => new Tile("grass", false, false)));
        this.lastModified = new Date();
    }

    get flattenedTileMatrix(): Tile[] {
        return this.tileMatrix.reduce((acc, row) => [...acc, ...row], []);
      }
}