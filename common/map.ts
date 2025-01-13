import { Tile } from "./tile";

export class Map {
    name: string;
    readonly size: number;
    isVisible: boolean;
    description: string;
    gameMode: "CTF" | "Classic";
    tileMatrix: Tile[][];
    lastModified: Date;

    constructor(name: string, size: number, isVisible: boolean, description: string, gameMode: "CTF" | "Classic", tileMatrix: Tile[][], lastModified: Date) {
        this.name = name;
        this.size = size;
        this.isVisible = isVisible;
        this.description = description;
        this.gameMode = gameMode;
        this.tileMatrix = tileMatrix;
        this.lastModified = lastModified;
    }
}