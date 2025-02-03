import { NgStyle } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BrushGridComponent } from '@app/components/edit-components/brush-grid/brush-grid.component';
import { DescriptionComponent } from '@app/components/edit-components/description/description.component';
import { ItemGridComponent } from '@app/components/edit-components/item-grid/item-grid.component';
import { ResetButtonComponent } from '@app/components/edit-components/reset-button/reset-button.component';
import { SaveButtonComponent } from '@app/components/edit-components/save-button/save-button.component';
import { TileGridComponent } from '@app/components/edit-components/tile-grid/tile-grid.component';
import { TitleComponent } from '@app/components/edit-components/title/title.component';
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditingToolService } from '@app/services/editing-tool.service';
import { ITEM_CONTAINER_COORDINATES, ItemService } from '@app/services/item.service';
import { MapService } from '@app/services/map.service';
import { MouseService } from '@app/services/mouse.service';
import { ItemObject } from '@common/ItemObject';

import { Router } from '@angular/router';

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
export class EditPageComponent implements OnInit {
    title = this.mapService.map.name;
    description = this.mapService.map.description;

    // constructor for router (there was no space left)
    protected router = inject(Router);

    constructor(
        private readonly mouseService: MouseService,
        protected mapService: MapService,
        protected dragAndDropService: DragAndDropService,
        protected itemService: ItemService,
        protected saveService: SaveButtonComponent,
    ) {}

    ngOnInit() {
        // preload image in cache
        const img = new Image();
        img.src = 'assets/openDoorTile.png';
    }

    onMouseDown(event: MouseEvent) {
        this.mouseService.isMouseDown = true;
        this.mouseService.isRightClick = event.button === 2; // 1: left-click, 2: right-click (MDN Web Docs)
    }

    onMouseUp(): void {
        this.mouseService.isMouseDown = false;

        const item = this.dragAndDropService.currentDraggedItem;
        if (!item) {
            return;
        }

        if (this.isHoveredOutsideGrid()) {
            this.handleItemOutsideGrid(item);
        }

        this.dragAndDropService.onMouseUp(item.name);
    }

    onDragEnd() {
        this.mouseService.isMouseDown = false;
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

    onSave() {
        this.updateValue();
        this.router.navigate(['/main-page']);
    }

    updateValue() {
        if (!this.title || this.title.trim() === '') {
            this.title = 'Untitled'; // Reset to default if empty
        }
        this.mapService.map.name = this.title;
        this.mapService.map.description = this.description;
        // Add any additional logic you need to handle the updated value
    }

    private isHoveredOutsideGrid(): boolean {
        const { row, column } = this.dragAndDropService.currentHoveredTile;
        return row === -1 && column === -1;
    }

    private handleItemOutsideGrid(item: ItemObject): void {
        const { row, column } = this.dragAndDropService.startTile;

        if (this.isItemFromContainer(row, column)) {
            this.itemService.increaseItemAmount(item.name);
        } else {
            this.itemService.resetTileToStartPosition(row, column);
        }
    }

    private isItemFromContainer(row: number, column: number): boolean {
        return row === ITEM_CONTAINER_COORDINATES.row && column === ITEM_CONTAINER_COORDINATES.column;
    }
}

// TODO: make the hovered tile a different color when dragging an item over it
// TODO: make click to delete item
// TODO: when item is not in container, it needs to stay grayed out and not be draggable
// TODO: replace the ItemId with the GameObject in Item component
// TODO: add description to ItemObject
