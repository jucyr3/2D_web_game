import { Injectable } from '@angular/core';
import { ItemObject } from '@common/ItemObject';
import { TileTypes } from '@common/tileType.constants';
import { ITEM_CONTAINER_COORDINATES, ItemService } from './item.service';
import { MapService } from './map.service';

@Injectable({
    providedIn: 'root',
})
export class DragAndDropService {
    currentHoveredTile: { row: number; column: number } = { row: -1, column: -1 };

    startTile: { row: number; column: number } = { row: -1, column: -1 };

    private draggingStates: { [itemId: string]: { isDragging: boolean; dragX: number; dragY: number } } = {};

    // Track the currently dragged item's ID
    private _currentDraggedItem: ItemObject | null = null;
    private _isDragging: boolean = false;

    constructor(
        private readonly mapService: MapService,
        private readonly itemService: ItemService,
    ) {}

    // Expose the currently dragged item's ID
    get currentDraggedItem(): ItemObject | null {
        return this._currentDraggedItem;
    }

    get isDragging(): boolean {
        return this._isDragging;
    }

    // Track the current hovered tile

    setCurrentHoveredTile(row: number, column: number): void {
        this.currentHoveredTile = { row, column };
    }

    startDragging(itemObject: ItemObject, event: MouseEvent, startRow: number, startColumn: number): void {
        // Set the currently dragged item's ID
        this._currentDraggedItem = itemObject;
        this._isDragging = true;

        this.startTile = { row: startRow, column: startColumn };

        // Initialize dragging state for this item
        this.draggingStates[itemObject.name] = {
            isDragging: true,
            dragX: event.clientX,
            dragY: event.clientY,
        };

        // Prevent text selection
        event.preventDefault();
    }

    onMouseMove(itemId: string, event: MouseEvent): void {
        if (this.draggingStates[itemId]?.isDragging) {
            this.draggingStates[itemId].dragX = event.clientX;
            this.draggingStates[itemId].dragY = event.clientY;
        }
    }

    onMouseUp(itemId: string): void {
        this._isDragging = false;
        if (this.draggingStates[itemId]) {
            this.draggingStates[itemId].isDragging = false;
        }

        // Reset the currently dragged item's ID
        this._currentDraggedItem = null;
    }

    getDraggingState(itemId: string): { isDragging: boolean; dragX: number; dragY: number } {
        return this.draggingStates[itemId] || { isDragging: false, dragX: 0, dragY: 0 };
    }

    handleDraggedItemPlacement(row: number, column: number): void {
        if (!this.currentDraggedItem) {
            return;
        }
        let currentTileType: TileTypes = TileTypes.GROUND_1;
        if (row !== -1 && column !== -1) {
            currentTileType = this.mapService.getTileType(row, column);
        }
        const isDoorOrWall = [TileTypes.DOOR, TileTypes.OPEN_DOOR, TileTypes.WALL].includes(currentTileType);

        if (isDoorOrWall || this.mapService.getItemObject(row, column) || this.isHoveredOutsideGrid()) {
            this.handleInvalidItemPlacement(this.currentDraggedItem);
        } else {
            this.mapService.placeGameObject(row, column, this.currentDraggedItem);
        }
    }

    private handleInvalidItemPlacement(draggedItem: ItemObject): void {
        if (this.isItemFromContainer()) {
            this.itemService.increaseItemAmount(draggedItem.name);
        } else {
            this.mapService.resetItemToStartPosition(this.startTile.row, this.startTile.column, draggedItem);
        }
    }

    private isItemFromContainer(): boolean {
        return this.startTile.row === ITEM_CONTAINER_COORDINATES.row && this.startTile.column === ITEM_CONTAINER_COORDINATES.column;
    }

    private isHoveredOutsideGrid(): boolean {
        const { row, column } = this.currentHoveredTile;
        return row === -1 && column === -1;
    }
}
