import {Map} from "./map";

export class Game {
    id: number;
    gameName: string;
    map: Map;

    constructor(id: number, gameName: string, map: Map) {
        this.id = id;
        this.gameName = gameName;
        this.map = map;
    }

    updateLastModified(): void {
        this.map.lastModified = new Date();
    }

    toggleVisibility(): void {
        this.map.isVisible = !this.map.isVisible;
    }

    toString(): string {
        return `Game ${this.gameName} (ID: ${this.id}), Mode: ${this.map.gameMode}, Size: ${this.map.size}`;
    }
}