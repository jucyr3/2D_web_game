import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { BrushGridComponent } from '@app/components/edit-components/brush-grid/brush-grid.component';
import { DescriptionComponent } from '@app/components/edit-components/description/description.component';
import { TitleComponent } from '@app/components/edit-components/title/title.component';
import { ItemGridComponent } from '@app/components/edit-components/item-grid/item-grid.component';
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditingToolService } from '@app/services/editing-tool.service';
import { ITEM_CONTAINER_COORDINATES, ItemService } from '@app/services/item.service';
import { MapService } from '@app/services/map.service';
import { MouseService } from '@app/services/mouse.service';
import { ResetButtonComponent } from '../../components/edit-components/reset-button/reset-button.component';
import { SaveButtonComponent } from '../../components/edit-components/save-button/save-button.component';
import { TileGridComponent } from '@app/components/edit-components/tile-grid/tile-grid.component';

@Component({
    selector: 'app-edit-page',
    imports: [
        TileGridComponent,
        BrushGridComponent,
        ItemGridComponent,
        NgStyle,
        TitleComponent,
        DescriptionComponent,
        SaveButtonComponent,
        ResetButtonComponent,
    ],
    templateUrl: './edit-page.component.html',
    styleUrl: './edit-page.component.scss',
    providers: [EditingToolService],
})
export class EditPageComponent {
    title = this.mapService.map.name;
    description = this.mapService.map.description;

    constructor(
        private readonly mouseService: MouseService,
        protected mapService: MapService,
        protected dragAndDropService: DragAndDropService,
        protected itemService: ItemService,
    ) {}

    onMouseDown(event: MouseEvent) {
        this.mouseService.isMouseDown = true;
        this.mouseService.isRightClick = event.button === 2; // 1: left-click, 2: right-click (MDN Web Docs)
    }

    onMouseUp() {
        this.mouseService.isMouseDown = false;
        const item = this.dragAndDropService.currentDraggedItem;
        if (item) {
            if (this.dragAndDropService.currentHoveredTile.row === -1 && this.dragAndDropService.currentHoveredTile.column === -1) {
                if (
                    this.dragAndDropService.startTile.row === ITEM_CONTAINER_COORDINATES.row &&
                    this.dragAndDropService.startTile.column === ITEM_CONTAINER_COORDINATES.column
                ) {
                    this.itemService.increaseItemAmount(item.name);
                } else {
                    this.itemService.resetTileToStartPosition(this.dragAndDropService.startTile.row, this.dragAndDropService.startTile.column);
                }
            }

            this.dragAndDropService.onMouseUp(item.name);
        }
    }

    onMouseLeave() {
        this.onMouseUp();
    }

    onMouseMove(event: MouseEvent): void {
        const item = this.dragAndDropService.currentDraggedItem;
        if (item) {
            this.dragAndDropService.onMouseMove(item.name, event);
        }
    }

    onDescriptionInput(event: Event) {
        this.description = (event.target as HTMLInputElement).value;
    }

    onBlur() {
        this.updateValue();
    }

    updateValue() {
        if (!this.title || this.title.trim() === '') {
            this.title = 'Untitled'; // Reset to default if empty
        }
        this.mapService.map.name = this.title;
        this.mapService.map.description = this.description;
        // Add any additional logic you need to handle the updated value
    }
}

// TODO: make the hovered tile a different color when dragging an item over it
// TODO: make click to delete item
// TODO: when item is not in container, it needs to stay grayed out and not be draggable
// TODO: replace the ItemId with the GameObject in Item component
// TODO: add description to ItemObject
