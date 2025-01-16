import { Component } from '@angular/core';
import { TileGridComponent } from '@app/components/tile-grid/tile-grid.component';
import { EditingToolService } from '@app/services/editing-tool.service';
import { BrushGridComponent } from "../../components/brush-grid/brush-grid.component";
import { MouseService } from '@app/services/mouse.service';

@Component({
  selector: 'app-edit-page',
  imports: [TileGridComponent, BrushGridComponent],
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss',
  providers: [EditingToolService]
})
export class EditPageComponent {

  constructor (private mouseService: MouseService) { }


  onMouseDown(event: MouseEvent) {
    this.mouseService.isMouseDown = true;
    this.mouseService.isRightClick = event.button === 2; // 1: left-click, 2: right-click (MDN Web Docs)
  }

  onMouseUp() {
    this.mouseService.isMouseDown= false;
  }
}
