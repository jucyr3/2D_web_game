import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DragAndDropService {
  private draggingStates: { [itemId: string]: { isDragging: boolean; dragX: number; dragY: number } } = {};

  // Track the currently dragged item's ID
  private _currentDraggedItemId: string = '';
  private _isDragging: boolean = false;

  // Expose the currently dragged item's ID
  get currentDraggedItemId(): string {
    return this._currentDraggedItemId;
  }

  get isDragging(): boolean {
    return this._isDragging;
  }

  // Track the current hovered tile
  currentHoveredTile: { row: number; column: number } = { row: -1, column: -1 };

  setCurrentHoveredTile(row: number, column: number): void {
    this.currentHoveredTile = { row, column };
  }

  startDragging(itemId: string, event: MouseEvent): void {
    // Set the currently dragged item's ID
    this._currentDraggedItemId = itemId;
    this._isDragging = true;

    // Initialize dragging state for this item
    this.draggingStates[itemId] = {
      isDragging: true,
      dragX: event.clientX,
      dragY: event.clientY,
    };

    // Prevent text selection
    event.preventDefault();
  }

  onMouseMove(itemId: string, event: MouseEvent): void {
    if (this.draggingStates[itemId]?.isDragging) {
      this.draggingStates[itemId].dragX = event.clientX;
      this.draggingStates[itemId].dragY = event.clientY;
    }
  }

  onMouseUp(itemId: string): void {
    this._isDragging = false;
    if (this.draggingStates[itemId]) {
      this.draggingStates[itemId].isDragging = false;
    }

    // Reset the currently dragged item's ID
    this._currentDraggedItemId = '';
  }

  getDraggingState(itemId: string): { isDragging: boolean; dragX: number; dragY: number } {
    return this.draggingStates[itemId] || { isDragging: false, dragX: 0, dragY: 0 };
  }
}