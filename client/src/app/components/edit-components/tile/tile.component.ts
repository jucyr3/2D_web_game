// Angular Core and Common Modules
import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

// Services
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditingToolService } from '@app/services/editing-tool.service';
import { ITEM_CONTAINER_COORDINATES, ItemService } from '@app/services/item.service';
import { MapService } from '@app/services/map.service';
import { MouseService } from '@app/services/mouse.service';

// Interfaces and Models
import { Coordinate } from '@app/interfaces/coordinate';
import { ItemObject } from '@common/ItemObject';
import { Tile } from '@common/tile';

// Constants
import { EditToolTypes } from '@app/services/editing-tool.constants';
import { TileTypes } from '@common/tileType.constants';

@Component({
    selector: 'app-tile',
    imports: [NgStyle, NgClass, MatTooltipModule],
    templateUrl: './tile.component.html',
    styleUrl: './tile.component.scss',
})
export class TileComponent implements OnInit {
    @Input() tileNumber: number;
    @Input() tileObject: Tile;

    @ViewChild('tooltip') tooltip!: MatTooltip;

    tilePosition: Coordinate;

    constructor(
        protected readonly editingToolService: EditingToolService,
        protected readonly mouseService: MouseService,
        protected readonly mapService: MapService,
        private readonly dragAndDropService: DragAndDropService,
        private readonly itemService: ItemService,
    ) {}

    get tileTexture(): string {
        return this.editingToolService.getTileImage(this.mapService.getTileType(this.tilePosition.row, this.tilePosition.column));
    }

    get itemObject(): ItemObject | null {
        return this.mapService.getItemObject(this.tilePosition.row, this.tilePosition.column);
    }

    ngOnInit(): void {
        this.initializeTile();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseService.isRightClick = event.button === 2;

        if (this.itemObject && !this.mouseService.isRightClick) {
            this.startDraggingItem(event);
        }
        this.editingToolService.setInterpolationPoints(this.tilePosition);
        this.tooltip.hide();
    }

    onMouseUp(): void {
        this.mouseService.isMouseDown = false;

        const draggedItem = this.dragAndDropService.currentDraggedItem;
        if (draggedItem) {
            this.handleDraggedItemPlacement(draggedItem);

            this.editingToolService.setActiveTool(EditToolTypes.TileBrush);
            this.editingToolService.resetProcessedTiles();
            this.showTooltipIfHovered();
            this.dragAndDropService.onMouseUp(draggedItem.name);
        }
    }

    onMouseLeave(): void {
        this.tooltip.hide();
    }

    onMouseEnter(): void {
        if (this.mouseService.isMouseDown) {
            this.editingToolService.setInterpolationPoints(this.tilePosition);
        }
        this.dragAndDropService.setCurrentHoveredTile(this.tilePosition.row, this.tilePosition.column);
    }

    onRightClick(): void {
        if (this.itemObject) {
            this.editingToolService.removeItemObjectFromTile(this.tilePosition.row, this.tilePosition.column, this.itemObject);
        }
    }

    shouldShowGrabCursor(): boolean {
        return this.itemObject !== null && this.editingToolService.getActiveTool() === EditToolTypes.Hand;
    }

    getFormattedTooltip(): string {
        if (!this.itemObject) return '';
        const capitalizedName = this.itemObject.name.charAt(0).toUpperCase() + this.itemObject.name.slice(1);
        return `${capitalizedName}: \n ${this.itemObject.description}`;
    }

    isTooltipEnabled(): boolean {
        //return this.itemObject !== null && !this.mouseService.isMouseDown;
        return false;
    }

    private initializeTile(): void {
        const row = Math.floor(this.tileNumber / this.mapService.map.size);
        const column = this.tileNumber % this.mapService.map.size;
        this.tilePosition = { row, column };

        if (this.itemObject) {
            this.itemService.decreaseItemAmount(this.itemObject.name);
        }
    }

    private startDraggingItem(event: MouseEvent): void {
        if (this.itemObject) {
            this.editingToolService.setActiveTool(EditToolTypes.Hand);
            this.dragAndDropService.startDragging(this.itemObject, event, this.tilePosition.row, this.tilePosition.column);
            this.mapService.removeGameObject(this.tilePosition.row, this.tilePosition.column);
        }
    }

    private handleInvalidItemPlacement(draggedItem: ItemObject): void {
        if (this.isItemFromContainer()) {
            this.itemService.increaseItemAmount(draggedItem.name);
        } else {
            this.itemService.resetTileToStartPosition(this.dragAndDropService.startTile.row, this.dragAndDropService.startTile.column);
        }
    }

    private handleDraggedItemPlacement(draggedItem: ItemObject): void {
        const currentTileType = this.mapService.getTileType(this.tilePosition.row, this.tilePosition.column);
        const isDoorOrWall = [TileTypes.DOOR, TileTypes.OPEN_DOOR, TileTypes.WALL].includes(currentTileType);

        if (isDoorOrWall || this.itemObject) {
            this.handleInvalidItemPlacement(draggedItem);
        } else {
            this.mapService.placeGameObject(this.tilePosition.row, this.tilePosition.column, draggedItem);
        }
    }

    private isItemFromContainer(): boolean {
        return (
            this.dragAndDropService.startTile.row === ITEM_CONTAINER_COORDINATES.row &&
            this.dragAndDropService.startTile.column === ITEM_CONTAINER_COORDINATES.column
        );
    }

    private showTooltipIfHovered(): void {
        if (
            this.dragAndDropService.currentHoveredTile.row === this.tilePosition.row &&
            this.dragAndDropService.currentHoveredTile.column === this.tilePosition.column
        ) {
            setTimeout(() => this.tooltip.show(), 1);
        }
    }
}
