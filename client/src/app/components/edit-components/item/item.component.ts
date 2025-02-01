import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditToolTypes } from '@app/services/editing-tool.constants';
import { EditingToolService } from '@app/services/editing-tool.service';
import { ITEM_CONTAINER_COORDINATES, ItemService } from '@app/services/item.service';
import { ItemObject } from '@common/ItemObject';
import { MatTooltipModule, MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-item',
    imports: [NgIf, NgClass, MatTooltipModule],
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnDestroy, OnInit {
    @Input() itemId: string; // Unique identifier for each item

    @ViewChild('tooltip') tooltip!: MatTooltip;

    itemObject: ItemObject;

    constructor(
        protected readonly dragAndDropService: DragAndDropService,
        private readonly editingToolService: EditingToolService,
        protected readonly itemService: ItemService,
    ) {}

    get draggingState() {
        return this.dragAndDropService.getDraggingState(this.itemObject.name);
    }

    ngOnInit(): void {
        this.itemObject = this.itemService.createItem(this.itemId);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.itemService.itemAmounts[this.itemObject.name] <= 0) {
            return;
        }
        this.itemService.decreaseItemAmount(this.itemObject.name);
        this.editingToolService.setActiveTool(EditToolTypes.Hand);
        this.dragAndDropService.startDragging(this.itemObject, event, ITEM_CONTAINER_COORDINATES.row, ITEM_CONTAINER_COORDINATES.column);
    }

    onMouseUp(): void {
        if (this.draggingState.isDragging && this.dragAndDropService.currentDraggedItem) {
            // if the dragged items name is the same as this ones
            if (this.dragAndDropService.currentDraggedItem.name === this.itemObject.name) {
                this.itemService.increaseItemAmount(this.itemObject.name);
            }

            this.dragAndDropService.onMouseUp(this.itemObject.name);
        }
    }

    ngOnDestroy(): void {
        // Clean up dragging state for this item
        this.dragAndDropService.onMouseUp(this.itemObject.name);
    }

    getFormattedTooltip(): string {
        const name = this.itemObject ? this.itemObject.name : '';
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        const description = this.itemObject ? this.itemObject.description : '';
        return `${capitalizedName}: \n ${description}`;
    }
}
