// Angular Core and Common Modules
import { NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

// Services
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditingToolService } from '@app/services/editing-tool.service';
import { ITEM_TEXTURE_PATH } from '@app/../assets/items/item-texture-path';
import { MapService } from '@app/services/map.service';
import { MouseService } from '@app/services/mouse.service';
import { TippyDirective } from '@ngneat/helipopper';

// Components
import { ItemTooltipComponent } from '@app/components/edit-components/item-tooltip/item-tooltip.component';

// Interfaces and Models
import { Coordinate } from '@app/interfaces/coordinate';
import { ItemObject } from '@common/ItemObject';
import { Tile } from '@common/tile';

// Constants
import { EditToolTypes } from '@app/services/editing-tool.constants';

@Component({
    selector: 'app-tile',
    imports: [NgStyle, TippyDirective, ItemTooltipComponent],
    templateUrl: './tile.component.html',
    styleUrl: './tile.component.scss',
})
export class TileComponent implements OnInit {
    @Input() tileNumber: number;
    @Input() tileObject: Tile;

    itemTexturePath = ITEM_TEXTURE_PATH;

    tilePosition: Coordinate;

    constructor(
        protected readonly editingToolService: EditingToolService,
        protected readonly mouseService: MouseService,
        protected readonly mapService: MapService,
        private readonly dragAndDropService: DragAndDropService,
    ) {}

    get tileTexture(): string {
        return this.mapService.getTileTexture(this.tilePosition.row, this.tilePosition.column);
    }

    get itemObject(): ItemObject | null {
        return this.mapService.getItemObject(this.tilePosition.row, this.tilePosition.column);
    }

    get isTooltipEnabled(): boolean {
        return this.itemObject != null && !this.mouseService.isMouseDown;
    }

    ngOnInit(): void {
        this.initializeTile();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseService.isRightClick = event.button === 2;

        if (this.itemObject && !this.mouseService.isRightClick) {
            this.editingToolService.setActiveTool(EditToolTypes.Hand);
            this.dragAndDropService.startDragging(this.tilePosition.row, this.tilePosition.column, this.itemObject, event);
            this.mapService.removeGameObject(this.tilePosition.row, this.tilePosition.column);
        }
        this.editingToolService.setInterpolationPoints(this.tilePosition);
    }

    onMouseUp(): void {
        this.mouseService.isMouseDown = false;

        const draggedItem = this.dragAndDropService.currentDraggedItem;
        if (draggedItem) {
            this.editingToolService.onMouseUp();

            this.dragAndDropService.handleDraggedItemPlacement(this.tilePosition.row, this.tilePosition.column);
            this.dragAndDropService.onMouseUp(draggedItem.name);
        }
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

    private initializeTile(): void {
        const row = Math.floor(this.tileNumber / this.mapService.map.size);
        const column = this.tileNumber % this.mapService.map.size;
        this.tilePosition = { row, column };
    }
}
