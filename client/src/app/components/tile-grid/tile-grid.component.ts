import { Component } from '@angular/core';
import { TileComponent } from '../tile/tile.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tile-grid',
  imports: [TileComponent, NgFor],
  templateUrl: './tile-grid.component.html',
  styleUrl: './tile-grid.component.scss'
})
export class TileGridComponent {
  mapSize = 20;
  isMouseDown = false;

  onMouseDown() {
    this.isMouseDown = true;
  }

  onMouseUp() {
    this.isMouseDown = false;
  }

  onMouseLeave() {
    this.isMouseDown = false;
  }
}
