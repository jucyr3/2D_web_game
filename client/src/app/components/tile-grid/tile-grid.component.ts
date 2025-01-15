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
  mapSize = 20;  // TODO: put in constant file
  isMouseDown = false;
  isRightClick = false;

  ngOnInit() {
    document.addEventListener('contextmenu', this.disableContextMenu);
  }

  ngOnDestroy() {
    document.removeEventListener('contextmenu', this.disableContextMenu);
  }

  disableContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  onMouseDown(event: MouseEvent) {
    this.isMouseDown = true;
    this.isRightClick = event.button === 2; // 1: left-click, 2: right-click (MDN Web Docs)
  }

  onMouseUp() {
    this.isMouseDown = false;
  }

  onMouseLeave() {
    this.isMouseDown = false;
  }

  onMouseEnter(event: MouseEvent) {
    if (event.buttons !== 0) {
      this.isMouseDown = true;
      this.isRightClick = event.buttons === 2;
    }
  }
}
