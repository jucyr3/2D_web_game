import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EDIT_TOOL_TYPES } from '@app/services/editing-tool.constants';
import { MapService } from '@app/services/map.service';
import { MouseService } from '@app/services/mouse.service';
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditingToolService } from '../../services/editing-tool.service';
import { TileTypes } from '@app/../../../common/tileType.constants';
import { ItemObject } from '@app/../../../common/itemObject';
import { GameObject } from '@app/../../../common/gameObject.interface';

@Component({
    selector: 'app-tile',
    imports: [NgStyle],
    templateUrl: './tile.component.html',
    styleUrl: './tile.component.scss',
})
export class TileComponent {
    @Input() tileNumber: number;

    // TODO Add attribute for GameObject contained in tile
    gameObject: GameObject | null = null;

    tileTexture: string;
    tileType: TileTypes;

    row: number;
    column: number;

    constructor(
        private readonly editingToolService: EditingToolService,
        private readonly mouseService: MouseService,
        private readonly mapService: MapService,
        private readonly dragAndDropService: DragAndDropService
    ) {}

    ngOnInit() {
        this.tileTexture = this.editingToolService.getTileImage(TileTypes.GROUND_1); // Initialize here
        this.row = Math.floor(this.tileNumber / this.mapService.map.size);
        this.column = this.tileNumber % this.mapService.map.size;
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
        
        this.dragAndDropService.setCurrentHoveredTile(this.row, this.column);
    }

    private handleItemDragging(event: MouseEvent): void {

        if (this.editingToolService.getActiveTool() !== EDIT_TOOL_TYPES.HAND) {
            return;
        }
        if (this.gameObject) {
            this.dragAndDropService.startDragging(this.gameObject.name, event);
            this.gameObject = null;
            this.mapService.removeGameObject(this.row, this.column);
            // take the item in hand
        }

        //! temporary code, get out item creation elsewhere
        else if (this.dragAndDropService.currentDraggedItemId && !this.gameObject) {
            // TODO: should work for everyGameObject
            let newGameObject = new ItemObject(this.dragAndDropService.currentDraggedItemId);
            this.gameObject = newGameObject;
            this.mapService.placeGameObject(this.row, this.column, newGameObject);
        }
    }

    private handleTileBrush(isErase: boolean): void {
        if (this.editingToolService.getActiveTool() === EDIT_TOOL_TYPES.TILE_BRUSH) {
            if (isErase) {
                this.eraseTile();
            } else {
                this.placeTile();
            }
        }
    }

    //? maybe logic to much coupled with view, possible refactor
    placeTile() {
        this.tileTexture = this.editingToolService.getTileImage(this.editingToolService.getCurrentTileTypeOnBrush());
        this.mapService.changeTileType(this.row, this.column, this.editingToolService.getCurrentTileTypeOnBrush());
    }

    eraseTile() {
        this.tileType = TileTypes.GROUND_1;
        this.tileTexture = `url(assets/${TileTypes.GROUND_1}.png)`;
        this.mapService.setDefaultTileType(this.row, this.column);
    }
}
