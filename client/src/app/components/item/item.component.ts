import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditToolTypes } from '@app/services/editing-tool.constants';
import { EditingToolService } from '@app/services/editing-tool.service';
import { ItemFactoryService } from '@app/services/item-factory.service';
import { ItemObject } from '@common/ItemObject';

@Component({
    selector: 'app-item',
    imports: [NgIf, NgClass],
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnDestroy {
    @Input() itemId: string; // Unique identifier for each item

    itemObject: ItemObject;
    itemAmount: number;

    constructor(
        private readonly dragAndDropService: DragAndDropService,
        private readonly editingToolService: EditingToolService,
        private readonly itemFactoryService: ItemFactoryService
    ) {}

    ngOnInit(): void {
        const { itemObject, itemAmount } = this.itemFactoryService.createItem(this.itemId);
        this.itemObject = itemObject;
        this.itemAmount = itemAmount;
    }

    get draggingState() {
        return this.dragAndDropService.getDraggingState(this.itemId);
    }

    onMouseDown(event: MouseEvent): void {
        this.itemAmount--;
        this.editingToolService.setActiveTool(EditToolTypes.Hand);
        this.dragAndDropService.startDragging(this.itemObject, event);
    }

    ngOnDestroy(): void {
        // Clean up dragging state for this item
        this.dragAndDropService.onMouseUp(this.itemId);
    }
}
