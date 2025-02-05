import { Injectable } from '@angular/core';
import { TileTypes } from '@app/../../../common/tileType.constants';
import { Coordinate } from '@app/interfaces/coordinate';
import { ItemObject } from '@common/ItemObject';
import { MapService } from './map.service';
import { MouseService } from './mouse.service';

export const TILE_TEXTURE_PATH = 'assets/tiles/';

export enum EditToolTypes {
    TileBrush = 'tileBrush',
    Hand = 'hand',
}

@Injectable({
    providedIn: 'root',
})
export class EditingToolService {
    startTile: Coordinate | null = null;
    endTile: Coordinate | null = null;

    previousStartTile: Coordinate | null = null;
    previousEndTile: Coordinate | null = null;

    private readonly processedTiles: Set<string> = new Set();

    private activeTool: EditToolTypes = EditToolTypes.Hand;
    private currentTileTypeOnBrush: TileTypes = TileTypes.GROUND_1;

    constructor(
        private readonly mapService: MapService,
        private readonly mouseService: MouseService,
    ) {}

    setActiveTool(tool: EditToolTypes) {
        this.activeTool = tool;
    }

    getActiveTool(): EditToolTypes {
        return this.activeTool;
    }

    setTileTypeOnBrush(tileType: TileTypes) {
        this.currentTileTypeOnBrush = tileType;
    }

    getCurrentTileTypeOnBrush(): TileTypes {
        return this.currentTileTypeOnBrush;
    }

    onMouseUp(): void {
        this.resetProcessedTiles();
        this.resetInterpolationPoints();
        this.setActiveTool(EditToolTypes.TileBrush);
    }

    getPath(start: Coordinate, end: Coordinate): Coordinate[] {
        // Bresenham's Line Algorithm
        const dx = Math.abs(end.column - start.column);
        const dy = Math.abs(end.row - start.row);

        const points: Coordinate[] = [];
        let x = start.column;
        let y = start.row;

        const stepX = x < end.column ? 1 : -1;
        const stepY = y < end.row ? 1 : -1;

        let error = dx - dy;
        const maxIterations = dx + dy;
        let iterations = 0;

        while (iterations <= maxIterations) {
            iterations++;

            points.push({ row: y, column: x });

            if (x === end.column && y === end.row) {
                break;
            }

            const error2 = 2 * error;

            if (error2 > -dy) {
                error -= dy;
                x += stepX;
            }

            if (error2 < dx) {
                error += dx;
                y += stepY;
            }
        }

        this.previousStartTile = start;
        this.previousEndTile = end;

        return points;
    }

    paintInterpolatedPath(): void {
        if (!this.isValidStartAndEndTile()) {
            return;
        }

        let points: Coordinate[] = [];
        if (this.startTile && this.endTile) {
            points = this.getPath(this.startTile, this.endTile);
        }

        if (points.length === 0) {
            return;
        }

        this.updateProcessedTiles(points);
        this.processTiles(points);
    }

    resetInterpolationPoints(): void {
        this.startTile = null;
        this.endTile = null;
    }

    eraseTile(row: number, column: number): void {
        const itemObjectOnTile = this.mapService.getItemObject(row, column);

        if (!itemObjectOnTile || this.mouseService.isMouseDown) {
            this.placeTile(row, column, TileTypes.GROUND_1);
        }
    }

    placeTile(row: number, column: number, tileType: TileTypes): void {
        const currentTileType = this.mapService.getTileType(row, column);
        const itemObjectOnTile = this.mapService.getItemObject(row, column);

        if (itemObjectOnTile && this.isBrushWallOrDoor(tileType)) {
            this.removeItemObjectFromTile(row, column, itemObjectOnTile);
        }

        if (this.isDoorTile(currentTileType) && this.isBrushDoor(tileType)) {
            this.toggleDoorTile(row, column);
        } else {
            this.placeRegularTile(row, column, tileType);
        }
    }

    setInterpolationPoints(newPoint: Coordinate): void {
        if (this.activeTool === EditToolTypes.TileBrush) {
            if (!this.startTile) {
                this.startTile = newPoint;
                this.endTile = newPoint;
            } else {
                this.startTile = this.endTile;
                this.endTile = newPoint;
            }
            this.paintInterpolatedPath();
        }
    }

    resetProcessedTiles(): void {
        this.processedTiles.clear();
    }

    removeItemObjectFromTile(row: number, column: number, itemObject: ItemObject): void {
        this.mapService.itemManager.increaseItemAmount(itemObject.name);
        this.mapService.removeGameObject(row, column);
    }

    private isValidStartAndEndTile(): boolean {
        return this.startTile !== null && this.endTile !== null;
    }

    private updateProcessedTiles(points: { row: number; column: number }[]): void {
        const currentTileKeys = new Set(points.map((point) => this.getTileKey(point)));

        for (const tileKey of this.processedTiles) {
            if (!currentTileKeys.has(tileKey)) {
                this.processedTiles.delete(tileKey);
            }
        }
    }

    private processTiles(points: { row: number; column: number }[]): void {
        for (const point of points) {
            const tileKey = this.getTileKey(point);

            if (this.shouldSkipTile(point, tileKey)) {
                continue;
            }

            this.processedTiles.add(tileKey);
            this.handleTileAction(point);
        }
    }

    private getTileKey(point: { row: number; column: number }): string {
        return `${point.row},${point.column}`;
    }

    private shouldSkipTile(point: { row: number; column: number }, tileKey: string): boolean {
        const arePreviousTilesEqual =
            this.previousStartTile?.row === this.previousEndTile?.row && this.previousEndTile?.column === this.previousStartTile?.column;

        const isStartTileEqual = this.startTile?.row === point.row && this.startTile?.column === point.column;

        return this.processedTiles.has(tileKey) && !arePreviousTilesEqual && isStartTileEqual;
    }

    private handleTileAction(point: { row: number; column: number }): void {
        if (this.mouseService.isRightClick) {
            this.eraseTile(point.row, point.column);
        } else {
            this.placeTile(point.row, point.column, this.currentTileTypeOnBrush);
        }
    }

    private isBrushWallOrDoor(tileType: TileTypes): boolean {
        return tileType === TileTypes.WALL || tileType === TileTypes.DOOR;
    }

    private isDoorTile(tileType: TileTypes): boolean {
        return tileType === TileTypes.DOOR || tileType === TileTypes.OPEN_DOOR;
    }

    private isBrushDoor(tileType: TileTypes): boolean {
        return tileType === TileTypes.DOOR;
    }

    private toggleDoorTile(row: number, column: number): void {
        const currentTileType = this.mapService.getTileType(row, column);
        const newTileType = currentTileType === TileTypes.DOOR ? TileTypes.OPEN_DOOR : TileTypes.DOOR;
        this.mapService.changeTileType(row, column, newTileType);
    }

    private placeRegularTile(row: number, column: number, tileType: TileTypes): void {
        this.mapService.changeTileType(row, column, tileType);
    }
}
