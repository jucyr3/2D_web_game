import { NgClass, NgStyle } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Coordinate } from '@app/interfaces/coordinate';
import { ItemObject } from '@common/ItemObject';
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditingToolService } from '@app/services/editing-tool.service';
import { MapService } from '@app/services/map.service';
import { MouseService } from '@app/services/mouse.service';
import { EditToolTypes } from '@app/services/editing-tool.constants';
import { TileTypes } from '@common/tileType.constants';
import { ItemService } from '@app/services/item.service';
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
        if (this.itemObject) {
            this.editingToolService.setActiveTool(EditToolTypes.Hand);
        }

        this.handleTileBrush(event.button === 2);

        if (this.itemObject && this.editingToolService.getActiveTool() === EditToolTypes.Hand) {
            this.dragAndDropService.startDragging(this.itemObject, event, this.tilePosition.row, this.tilePosition.column);
            this.itemObject = null;
            this.mapService.removeGameObject(this.tilePosition.row, this.tilePosition.column);
        }

        this.tooltip.hide();

    }

    onMouseUp(): void {
        if (!this.dragAndDropService.currentDraggedItem) {
            return;
        } else if (this.itemObject) {
            this.itemService.increaseItemAmount(this.itemObject.name);
            this.itemObject = this.dragAndDropService.currentDraggedItem;
            this.mapService.placeGameObject(this.tilePosition.row, this.tilePosition.column, this.itemObject);
        } else {
            this.itemObject = this.dragAndDropService.currentDraggedItem;
            this.mapService.placeGameObject(this.tilePosition.row, this.tilePosition.column, this.itemObject);
        }

        this.editingToolService.setActiveTool(EditToolTypes.TileBrush);

        setTimeout(() => {
            this.tooltip.show();
        }, 1);
        
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.tooltip.hide();
    }

    
    onMouseEnter(): void {
        this.dragAndDropService.setCurrentHoveredTile(this.tilePosition.row, this.tilePosition.column);
        if (this.mouseService.isMouseDown) {
            this.handleTileBrush(this.mouseService.isRightClick);
        }
    }

    // ? maybe logic to much coupled with view, possible refactor
    placeTile() {
        const currentBrushTileType = this.editingToolService.getCurrentTileTypeOnBrush();
        const currentTileType = this.mapService.getTileType(this.tilePosition.row, this.tilePosition.column);
        const isDoorTile = currentTileType === TileTypes.DOOR || currentTileType === TileTypes.OPEN_DOOR;
        const isBrushDoor = currentBrushTileType === TileTypes.DOOR;

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
        if (this.editingToolService.getActiveTool() === EditToolTypes.TileBrush) {
            if (isErase) {
                this.eraseTile();
            } else {
                this.placeTile();
            }
        }
    }
}