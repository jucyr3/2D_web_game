import { Component } from '@angular/core';
import { TileComponent } from '../tile/tile.component';
import { NgFor } from '@angular/common';
import { MouseService } from '@app/services/mouse.service';

@Component({
  selector: 'app-tile-grid',
  imports: [TileComponent, NgFor],
  templateUrl: './tile-grid.component.html',
  styleUrl: './tile-grid.component.scss'
})
export class TileGridComponent {
  mapSize = 20;  // TODO: put in constant file

  constructor(private mouseService: MouseService) { }

  ngOnInit() {
    document.addEventListener('contextmenu', this.disableContextMenu);
  }

  ngOnDestroy() {
    document.removeEventListener('contextmenu', this.disableContextMenu);
  }

  disableContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  onMouseLeave() {
    this.mouseService.isMouseDown = false;
  }

  onMouseEnter(event: MouseEvent) {
    if (event.buttons !== 0) {
      this.mouseService.isMouseDown = true;
      this.mouseService.isRightClick = event.buttons === 2;
    }
  }
}
