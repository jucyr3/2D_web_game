import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Input } from '@angular/core';

@Component({
    selector: 'app-tile',
    imports: [NgStyle],
    templateUrl: './tile.component.html',
    styleUrl: './tile.component.scss',
})
export class TileComponent {
    tileColor: string = 'white';
    

    @Input() isMouseDown: boolean;
    @Input() tileNumber: number;
    @Input() tileType: string = "black"; //TODO pass the prop from grid depending on the brush selected
    //TODO Add attribute for GameObject contained in tile

    onMouseOver(): void {
        if (this.isMouseDown) {
            this.placeTile();
        }
    }

    placeTile() {
        //TODO change this to the good tiles instead of the color
        this.tileColor = this.tileType;
    }
}
