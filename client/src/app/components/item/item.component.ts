import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-item',
    imports: [NgIf, NgClass],
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnDestroy {
    @Input() itemType: string;

    isDragging = false;
    dragX = 0;
    dragY = 0;
    private mouseMoveListener: ((event: MouseEvent) => void) | null = null;
    private mouseUpListener: ((event: MouseEvent) => void) | null = null;

    onMouseDown(event: MouseEvent): void {
        this.isDragging = true;
        this.updateDragPosition(event);

        // Add global event listeners
        this.mouseMoveListener = this.onMouseMove.bind(this);
        this.mouseUpListener = this.onMouseUp.bind(this);

        document.addEventListener('mousemove', this.mouseMoveListener);
        document.addEventListener('mouseup', this.mouseUpListener);

        // Prevent text selection
        event.preventDefault();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isDragging) {
            this.updateDragPosition(event);
        }
    }

    onMouseUp(): void {
        this.isDragging = false;

        // Remove global event listeners
        if (this.mouseMoveListener) {
            document.removeEventListener('mousemove', this.mouseMoveListener);
            this.mouseMoveListener = null;
        }
        if (this.mouseUpListener) {
            document.removeEventListener('mouseup', this.mouseUpListener);
            this.mouseUpListener = null;
        }
    }

    private updateDragPosition(event: MouseEvent): void {
        this.dragX = event.clientX;
        this.dragY = event.clientY;
    }

    ngOnDestroy(): void {
        // Clean up by ensuring isDragging is false and removing any listeners
        this.isDragging = false;
        if (this.mouseMoveListener) {
            document.removeEventListener('mousemove', this.mouseMoveListener);
        }
        if (this.mouseUpListener) {
            document.removeEventListener('mouseup', this.mouseUpListener);
        }
    }
}
