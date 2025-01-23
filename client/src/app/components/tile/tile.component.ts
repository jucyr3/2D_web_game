import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { Coordinate } from '@app/interfaces/coordinate';
import { GameObject } from '@common/gameObject.interface';
import { ItemObject } from '@common/ItemObject';

import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditingToolService } from '@app/services/editing-tool.service';
import { MapService } from '@app/services/map.service';
import { MouseService } from '@app/services/mouse.service';

import { EditToolTypes } from '@app/services/editing-tool.constants';
import { TileTypes } from '@common/tileType.constants';

@Component({
    selector: 'app-tile',
    imports: [NgStyle, NgClass],
    templateUrl: './tile.component.html',
    styleUrl: './tile.component.scss',
})
export class TileComponent implements OnInit {
    @Input() tileNumber: number;

    // TODO Add attribute for GameObject contained in tile
    gameObject: GameObject | null = null;

    tileTexture: string;
    tileType: TileTypes;

    tilePosition: Coordinate;

    constructor(
        private readonly editingToolService: EditingToolService,
        private readonly mouseService: MouseService,
        private readonly mapService: MapService,
        private readonly dragAndDropService: DragAndDropService,
    ) {}

    ngOnInit() {
        this.tileTexture = this.editingToolService.getTileImage(TileTypes.GROUND_1); // Initialize here
        const row = Math.floor(this.tileNumber / this.mapService.map.size);
        const column = this.tileNumber % this.mapService.map.size;
        this.tilePosition = { x: row, y: column };
    }

    onMouseDown(event: MouseEvent): void {
        this.handleTileBrush(event.button === 2); // `true` if right-click, `false` otherwise
        this.handleItemDragging(event);
    }

    onMouseMove(): void {
        if (this.mouseService.isMouseDown) {
            this.handleTileBrush(this.mouseService.isRightClick);
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.handleItemDragging(event);
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
            this.gameObject !== null && // Check if the tile has a gameObject
            this.editingToolService.getActiveTool() === EditToolTypes.Hand // Check if the active tool is HAND
        );
    }

    private handleItemDragging(event: MouseEvent): void {
        if (this.editingToolService.getActiveTool() !== EditToolTypes.Hand) {
            return;
        }
        if (this.gameObject) {
            this.dragAndDropService.startDragging(this.gameObject.name, event);
            this.gameObject = null;
            this.mapService.removeGameObject(this.tilePosition.x, this.tilePosition.y);
            // take the item in hand
        }

        // ! temporary code, get out item creation elsewhere
        else if (this.dragAndDropService.currentDraggedItemId && !this.gameObject) {
            // TODO: should work for everyGameObject
            const newGameObject = new ItemObject(this.dragAndDropService.currentDraggedItemId);
            this.gameObject = newGameObject;
            this.mapService.placeGameObject(this.tilePosition.x, this.tilePosition.y, newGameObject);
        }
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
