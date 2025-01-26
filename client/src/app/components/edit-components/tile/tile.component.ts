import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Coordinate } from '@app/interfaces/coordinate';
import { ItemObject } from '@common/ItemObject';
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditingToolService } from '@app/services/editing-tool.service';
import { MapService } from '@app/services/map.service';
import { MouseService } from '@app/services/mouse.service';
import { EditToolTypes } from '@app/services/editing-tool.constants';
import { TileTypes } from '@common/tileType.constants';
import { ITEM_CONTAINER_COORDINATES, ItemService } from '@app/services/item.service';
import { Tile } from '@common/tile';
import { MatTooltipModule, MatTooltip } from '@angular/material/tooltip';

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
    itemObject: ItemObject | null = null;

    constructor(
        protected readonly editingToolService: EditingToolService,
        protected readonly mouseService: MouseService,
        protected readonly mapService: MapService,
        private readonly dragAndDropService: DragAndDropService,
        private readonly itemService: ItemService,
    ) {}

    get tileTexture() {
        return this.editingToolService.getTileImage(this.mapService.getTileType(this.tilePosition.row, this.tilePosition.column));
    }

    ngOnInit() {
        this.mapService.changeTileType(
            Math.floor(this.tileNumber / this.mapService.map.size),
            this.tileNumber % this.mapService.map.size,
            this.tileObject.type,
        );

        if (this.tileObject.gameObject) {
            this.itemObject = this.tileObject.gameObject;
            this.itemService.decreaseItemAmount(this.itemObject.name);
        }

        const row = Math.floor(this.tileNumber / this.mapService.map.size);
        const column = this.tileNumber % this.mapService.map.size;
        this.tilePosition = { row, column };
    }

    onMouseDown(event: MouseEvent): void {
        const isRightClick = event.button === 2;
        
        if (this.itemObject && !isRightClick) {
            this.editingToolService.setActiveTool(EditToolTypes.Hand);
            this.dragAndDropService.startDragging(this.itemObject, event, this.tilePosition.row, this.tilePosition.column);
            this.itemObject = null;
            this.mapService.removeGameObject(this.tilePosition.row, this.tilePosition.column);
        }

        this.handleTileBrush(event.button === 2);

        this.tooltip.hide();

    }

    onMouseUp(): void {
        const draggedItem = this.dragAndDropService.currentDraggedItem; 
        const currentTileType = this.mapService.getTileType(this.tilePosition.row, this.tilePosition.column);
        if (!draggedItem) {
            return;
        } else if (this.itemObject) {
            //TODO: Refactor this logic (maybe bundle everything in resetTileToStartPosition())
            if (
                this.dragAndDropService.startTile.row === ITEM_CONTAINER_COORDINATES.row &&
                this.dragAndDropService.startTile.column === ITEM_CONTAINER_COORDINATES.column
            ) {
                this.itemService.increaseItemAmount(draggedItem.name);
            } else {
                this.itemService.resetTileToStartPosition(this.dragAndDropService.startTile.row, this.dragAndDropService.startTile.column);
            }

            this.dragAndDropService.onMouseUp(draggedItem.name);
        } else {
            if (currentTileType === TileTypes.DOOR || currentTileType === TileTypes.OPEN_DOOR || currentTileType === TileTypes.WALL) {
                if (
                    this.dragAndDropService.startTile.row === ITEM_CONTAINER_COORDINATES.row &&
                    this.dragAndDropService.startTile.column === ITEM_CONTAINER_COORDINATES.column
                ) {
                    this.removeItemObjectFromTile(draggedItem);
                } else {
                    this.itemService.resetTileToStartPosition(this.dragAndDropService.startTile.row, this.dragAndDropService.startTile.column);
                }
    
                this.dragAndDropService.onMouseUp(draggedItem.name);
            } else {
                this.itemObject = draggedItem;
                this.mapService.placeGameObject(this.tilePosition.row, this.tilePosition.column, draggedItem);
            }
        }

        this.editingToolService.setActiveTool(EditToolTypes.TileBrush);

        if (this.dragAndDropService.currentHoveredTile.row === this.tilePosition.row && this.dragAndDropService.currentHoveredTile.column === this.tilePosition.column) {
            setTimeout(() => {
                this.tooltip.show();
            }, 1);
        }
        
    }

    onMouseLeave(): void {
        this.tooltip.hide();
    }

    
    onMouseEnter(): void {
        this.dragAndDropService.setCurrentHoveredTile(this.tilePosition.row, this.tilePosition.column);
        if (this.mouseService.isMouseDown) {
            this.handleTileBrush(this.mouseService.isRightClick);
        }
    }

    onRightClick(): void {
        if (this.itemObject) {
            this.removeItemObjectFromTile(this.itemObject);
        }
    }

    // ? maybe logic to much coupled with view, possible refactor
    placeTile() {
        const currentBrushTileType = this.editingToolService.getCurrentTileTypeOnBrush();
        const currentTileType = this.mapService.getTileType(this.tilePosition.row, this.tilePosition.column);
        const isDoorTile = currentTileType === TileTypes.DOOR || currentTileType === TileTypes.OPEN_DOOR;
        const isBrushDoor = currentBrushTileType === TileTypes.DOOR;
        const isBrushWall = currentBrushTileType === TileTypes.WALL;

        //If brush is wall of door, remove the object and increment the item amount
        if (this.itemObject && (isBrushWall || isBrushDoor)) {
            this.removeItemObjectFromTile(this.itemObject);
        }

        if (isDoorTile && isBrushDoor) {
            this.toggleDoorTile();
            return;
        }

        this.placeRegularTile(currentBrushTileType);
    }

    eraseTile() {
        this.mapService.changeTileType(this.tilePosition.row, this.tilePosition.column, TileTypes.GROUND_1);
    }

    shouldShowGrabCursor(): boolean {
        return (
            this.itemObject !== null && // Check if the tile has a gameObject
            this.editingToolService.getActiveTool() === EditToolTypes.Hand // Check if the active tool is HAND
        );
    }

    getFormattedTooltip(): string {
        const name = this.itemObject ? this.itemObject.name : '';
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        const description = this.itemObject ? this.itemObject.description : '';
        return `${capitalizedName}: \n ${description}`;
    }

    isTooltipEnabled(): boolean {
        return this.itemObject !== null && !this.mouseService.isMouseDown;
    }


    private removeItemObjectFromTile(itemObject: ItemObject) {
        this.itemService.increaseItemAmount(itemObject.name);
        this.itemObject = null;
        this.mapService.removeGameObject(this.tilePosition.row, this.tilePosition.column);
    }

    private toggleDoorTile() {
        const currentTileType = this.mapService.getTileType(this.tilePosition.row, this.tilePosition.column);
        const newTileType = currentTileType === TileTypes.DOOR ? TileTypes.OPEN_DOOR : TileTypes.DOOR;
        this.updateTile(newTileType);
    }

    private placeRegularTile(tileType: TileTypes) {
        this.updateTile(tileType);
    }

    private updateTile(tileType: TileTypes) {
        this.mapService.changeTileType(this.tilePosition.row, this.tilePosition.column, tileType);
    }

    private handleTileBrush(isErase: boolean): void {
        const isTileBrush = this.editingToolService.getActiveTool() === EditToolTypes.TileBrush;
        if (isTileBrush) {
            if (isErase) {
                this.eraseTile();
            } else {
                this.placeTile();
            }
        }
    }
}