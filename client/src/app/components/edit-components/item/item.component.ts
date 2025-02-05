import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DragAndDropService, ITEM_CONTAINER_COORDINATES } from '@app/services/edit-services/drag-and-drop.service';
import { EditingToolService, EditToolTypes } from '@app/services/edit-services/editing-tool.service';
import { ITEM_TEXTURE_PATH } from '@app/../assets/items/item-texture-path';
import { ItemObject } from '@common/ItemObject';
import { TippyDirective } from '@ngneat/helipopper';
import { ItemTooltipComponent } from '@app/components/edit-components/item-tooltip/item-tooltip.component';
import { MouseService, MouseButton } from '@app/services/edit-services/mouse.service';
import { MapService } from '@app/services/edit-services/map.service';

@Component({
    selector: 'app-item',
    imports: [NgIf, NgClass, TippyDirective, ItemTooltipComponent],
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnDestroy, OnInit {
    @Input() itemId: string;

    itemTexturePath = ITEM_TEXTURE_PATH;

    duration = 0;

    itemObject: ItemObject;

    constructor(
        protected readonly dragAndDropService: DragAndDropService,
        private readonly editingToolService: EditingToolService,
        protected readonly mouseService: MouseService,
        protected mapService: MapService,
    ) {}

    get isTooltipEnabled() {
        return !this.mouseService.isMouseDown;
    }

    get itemAmount() {
        return this.mapService.itemManager.itemAmounts[this.itemObject.name];
    }

    get draggingState() {
        return this.dragAndDropService.getDraggingState(this.itemObject.name);
    }

    ngOnInit(): void {
        this.itemObject = { name: this.itemId };
    }

    onMouseDown(event: MouseEvent): void {
        if (this.mapService.itemManager.itemAmounts[this.itemObject.name] <= 0 || event.button !== MouseButton.Left) {
            return;
        }
        this.mapService.itemManager.decreaseItemAmount(this.itemObject.name);
        this.editingToolService.setActiveTool(EditToolTypes.Hand);
        this.dragAndDropService.startDragging(ITEM_CONTAINER_COORDINATES.row, ITEM_CONTAINER_COORDINATES.column, this.itemObject, event);
    }

    onMouseUp(): void {
        if (this.draggingState.isDragging && this.dragAndDropService.currentDraggedItem) {
            if (this.dragAndDropService.currentDraggedItem.name === this.itemObject.name) {
                this.mapService.itemManager.increaseItemAmount(this.itemObject.name);
            }

            this.dragAndDropService.onMouseUp(this.itemObject.name);
            this.editingToolService.setActiveTool(EditToolTypes.TileBrush);
        }
    }

    ngOnDestroy(): void {
        this.dragAndDropService.onMouseUp(this.itemObject.name);
    }
}
