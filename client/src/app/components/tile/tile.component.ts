import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { EventEmitter, Output, Input } from '@angular/core';

@Component({
    selector: 'app-tile',
    imports: [NgStyle],
    templateUrl: './tile.component.html',
    styleUrl: './tile.component.scss',
})
export class TileComponent {
    tileColor: string = '0x000000';

    @Output() isMouseDownOutput = new EventEmitter<boolean>();
    @Input() isMouseDownInput: boolean;

    changeTileColor(color: string): void {
        this.tileColor = color;
    }

    onMouseDown(event: MouseEvent): void {
        this.isMouseDownOutput.emit(true);
    }

    onCellClick() {}

    onMouseUp(event: MouseEvent): void {
        this.isMouseDownOutput.emit(false);
    }

    OnMouseOver() {
        if (this.isMouseDownInput) {
            this.placeTile('black');
        }
    }

    placeTile(color: string) {
        //TODO change this to the good tiles instead of the color
        this.tileColor = color;
    }
}
