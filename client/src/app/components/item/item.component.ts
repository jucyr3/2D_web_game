import { Component, Input, OnDestroy } from '@angular/core';
import { DragAndDropService } from '../../services/drag-and-drop.service';
import { EditingToolService } from '../../services/editing-tool.service';
import { NgClass, NgIf } from '@angular/common';
import { EDIT_TOOL_TYPES } from '@app/services/editing-tool.constants';

@Component({
  selector: 'app-item',
  imports: [NgIf, NgClass],
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnDestroy {
  @Input() itemType: string;
  @Input() itemId: string; // Unique identifier for each item

  constructor(public dragAndDropService: DragAndDropService, public editingToolService: EditingToolService) {
    //this.ItemObject = new ItemObject(this.ItemId);
  }

  onMouseDown(event: MouseEvent): void {
    this.editingToolService.setActiveTool(EDIT_TOOL_TYPES.HAND)
    this.dragAndDropService.startDragging(this.itemId, event);
    console.log('Dragging:', this.itemType);
  }

  ngOnDestroy(): void {
    // Clean up dragging state for this item
    this.dragAndDropService.onMouseUp(this.itemId);
  }

  get draggingState() {
    return this.dragAndDropService.getDraggingState(this.itemId);
  }
}