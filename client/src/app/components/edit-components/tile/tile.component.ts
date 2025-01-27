// Angular Core and Common Modules
import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTooltipModule, MatTooltip } from '@angular/material/tooltip';

// Services
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditingToolService } from '@app/services/editing-tool.service';
import { MapService } from '@app/services/map.service';
import { MouseService } from '@app/services/mouse.service';
import { ItemService, ITEM_CONTAINER_COORDINATES } from '@app/services/item.service';

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
        private readonly itemService: ItemService
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
        const isRightClick = event.button === 2;

        if (this.itemObject && !isRightClick) {
            this.startDraggingItem(event);
        }
        this.handleTileBrush(isRightClick);
        this.tooltip.hide();
    }

    onMouseUp(): void {
        const draggedItem = this.dragAndDropService.currentDraggedItem;
        if (!draggedItem) return;

        if (this.itemObject) {
            this.handleItemDrop(draggedItem);
        } else {
            this.handleDraggedItemPlacement(draggedItem);
        }

        this.editingToolService.setActiveTool(EditToolTypes.TileBrush);
        this.showTooltipIfHovered();
    }

    onMouseLeave(): void {
        this.tooltip.hide();
    }

    onMouseEnter(): void {
        if (this.mouseService.isMouseDown) {
            this.handleTileBrush(this.mouseService.isRightClick);
        }
        this.dragAndDropService.setCurrentHoveredTile(this.tilePosition.row, this.tilePosition.column);
    }

    onRightClick(): void {
        if (this.itemObject) {
            this.removeItemObjectFromTile(this.itemObject);
        }
    }

    placeTile(): void { 
        const currentBrushTileType = this.editingToolService.getCurrentTileTypeOnBrush();
        const currentTileType = this.mapService.getTileType(this.tilePosition.row, this.tilePosition.column);

        if (this.itemObject && this.isBrushWallOrDoor(currentBrushTileType)) {
            this.removeItemObjectFromTile(this.itemObject);
        }

        if (this.isDoorTile(currentTileType) && this.isBrushDoor(currentBrushTileType)) {
            this.toggleDoorTile();
        } else {
            this.placeRegularTile(currentBrushTileType);
        }
    }

    eraseTile(): void {
        this.mapService.changeTileType(this.tilePosition.row, this.tilePosition.column, TileTypes.GROUND_1);
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
        return this.itemObject !== null && !this.mouseService.isMouseDown;
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

    private handleItemDrop(draggedItem: ItemObject): void {
        if (this.isItemFromContainer()) {
            this.itemService.increaseItemAmount(draggedItem.name);
        } else {
            this.itemService.resetTileToStartPosition(this.dragAndDropService.startTile.row, this.dragAndDropService.startTile.column);
        }
        this.dragAndDropService.onMouseUp(draggedItem.name);
    }

    private handleDraggedItemPlacement(draggedItem: ItemObject): void {
        const currentTileType = this.mapService.getTileType(this.tilePosition.row, this.tilePosition.column);
        const isDoorOrWall = [TileTypes.DOOR, TileTypes.OPEN_DOOR, TileTypes.WALL].includes(currentTileType);

        if (isDoorOrWall && this.isItemFromContainer()) {
            this.removeItemObjectFromTile(draggedItem);
        } else if (isDoorOrWall) {
            this.itemService.resetTileToStartPosition(this.dragAndDropService.startTile.row, this.dragAndDropService.startTile.column);
        } else {
            this.mapService.placeGameObject(this.tilePosition.row, this.tilePosition.column, draggedItem);
        }
        this.dragAndDropService.onMouseUp(draggedItem.name);
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

    private isBrushWallOrDoor(tileType: TileTypes): boolean {
        return tileType === TileTypes.WALL || tileType === TileTypes.DOOR;
    }

    private isDoorTile(tileType: TileTypes): boolean {
        return tileType === TileTypes.DOOR || tileType === TileTypes.OPEN_DOOR;
    }

    private isBrushDoor(tileType: TileTypes): boolean {
        return tileType === TileTypes.DOOR;
    }

    private removeItemObjectFromTile(itemObject: ItemObject): void {
        this.itemService.increaseItemAmount(itemObject.name);
        this.mapService.removeGameObject(this.tilePosition.row, this.tilePosition.column);
    }

    private toggleDoorTile(): void {
        const currentTileType = this.mapService.getTileType(this.tilePosition.row, this.tilePosition.column);
        const newTileType = currentTileType === TileTypes.DOOR ? TileTypes.OPEN_DOOR : TileTypes.DOOR;
        this.updateTile(newTileType);
    }

    private placeRegularTile(tileType: TileTypes): void {
        this.updateTile(tileType);
    }

    private updateTile(tileType: TileTypes): void {
        this.mapService.changeTileType(this.tilePosition.row, this.tilePosition.column, tileType);
    }

    private handleTileBrush(isErase: boolean): void {
        if (this.editingToolService.getActiveTool() === EditToolTypes.TileBrush) {
            this.mapService.startTile = this.mapService.endTile;
            this.mapService.endTile = this.tilePosition;
            this.mapService.paintInterpolatedPath();
            if (isErase) {
                this.eraseTile();
            } else {
                this.placeTile();
            }
        }
    }
}
