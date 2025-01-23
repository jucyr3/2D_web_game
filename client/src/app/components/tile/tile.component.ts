import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

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

@Component({
    selector: 'app-tile',
    imports: [NgStyle, NgClass],
    templateUrl: './tile.component.html',
    styleUrl: './tile.component.scss',
})
export class TileComponent implements OnInit {
    @Input() tileNumber: number;
    @Input() tileObject: Tile;

    // TODO Add attribute for GameObject contained in tile
    itemObject: ItemObject | null = null;

    tileTexture: string;
    tileType: TileTypes;

    tilePosition: Coordinate;

    constructor(
        private readonly editingToolService: EditingToolService,
        private readonly mouseService: MouseService,
        private readonly mapService: MapService,
        private readonly dragAndDropService: DragAndDropService,
        private readonly itemService: ItemService
    ) {}

    ngOnInit() {
        this.tileTexture = this.editingToolService.getTileImage(this.tileObject.type); // Initialize here
        this.tileType = this.tileObject.type;
        if (this.tileObject.gameObject) {
            this.itemObject = this.tileObject.gameObject;
            this.itemService.decreaseItemAmount(this.itemObject.name);
        }

        const row = Math.floor(this.tileNumber / this.mapService.map.size);
        const column = this.tileNumber % this.mapService.map.size;
        this.tilePosition = { x: row, y: column };
    }

    onMouseDown(event: MouseEvent): void {
        if (this.itemObject) {
            this.editingToolService.setActiveTool(EditToolTypes.Hand);
        }

        this.handleTileBrush(event.button === 2); // `true` if right-click, `false` otherwise

        if (this.itemObject && this.editingToolService.getActiveTool() === EditToolTypes.Hand) {
            this.dragAndDropService.startDragging(this.itemObject, event, this.tilePosition.x, this.tilePosition.y);
            this.itemObject = null;
            this.mapService.removeGameObject(this.tilePosition.x, this.tilePosition.y);
        }
    }

    onMouseMove(): void {
        if (this.mouseService.isMouseDown) {
            this.handleTileBrush(this.mouseService.isRightClick);
        }
    }

    onMouseUp(): void {
        if (!this.dragAndDropService.currentDraggedItem) {
            return;
        }

        else if (this.itemObject) {
            this.itemService.increaseItemAmount(this.itemObject.name);
            this.itemObject = this.dragAndDropService.currentDraggedItem;
            this.mapService.placeGameObject(this.tilePosition.x, this.tilePosition.y, this.itemObject);
        }
        else {
            this.itemObject = this.dragAndDropService.currentDraggedItem;
            this.mapService.placeGameObject(this.tilePosition.x, this.tilePosition.y, this.itemObject);
        }
        
        this.editingToolService.setActiveTool(EditToolTypes.TileBrush);
    }

    onMouseEnter(): void {
        this.dragAndDropService.setCurrentHoveredTile(this.tilePosition.x, this.tilePosition.y);
    }

    // ? maybe logic to much coupled with view, possible refactor
    placeTile() {
        this.tileTexture = this.editingToolService.getTileImage(this.editingToolService.getCurrentTileTypeOnBrush());
        this.mapService.changeTileType(this.tilePosition.x, this.tilePosition.y, this.editingToolService.getCurrentTileTypeOnBrush());
    }

    eraseTile() {
        this.tileType = TileTypes.GROUND_1;
        this.tileTexture = `url(assets/${TileTypes.GROUND_1}.png)`;
        this.mapService.setDefaultTileType(this.tilePosition.x, this.tilePosition.y);
    }

    shouldShowGrabCursor(): boolean {
        return (
            this.itemObject !== null && // Check if the tile has a gameObject
            this.editingToolService.getActiveTool() === EditToolTypes.Hand // Check if the active tool is HAND
        );
    }

    displayCoordinates(): void {
        console.log(`(${this.tilePosition.x}, ${this.tilePosition.y})`);
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
