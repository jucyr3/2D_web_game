export class Tile {
    type: string;
    isOccupied: boolean;
    isObstacle: boolean;

    constructor(type: string, isOccupied: boolean, isObstacle: boolean) {
        this.type = type;
        this.isOccupied = isOccupied;
        this.isObstacle = isObstacle;
    }
}
