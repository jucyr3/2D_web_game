import { Component } from '@angular/core';
import { TileGridComponent } from '@app/components/tile-grid/tile-grid.component';
import { EditingToolService } from '@app/services/editing-tool.service';
import { BrushGridComponent } from "../../components/brush-grid/brush-grid.component";
import { MouseService } from '@app/services/mouse.service';
import { MapSettingsModalComponent} from "../../components/map-settings-modal/map-settings-modal.component";
import { MapService } from '@app/services/map.service';

@Component({
  selector: 'app-edit-page',
  imports: [TileGridComponent, BrushGridComponent, MapSettingsModalComponent],
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss',
  providers: [EditingToolService]
})
export class EditPageComponent {
  showModal: boolean = false;

  constructor (private mouseService: MouseService, protected mapService: MapService) { }


  openMapSettingsModal() {
    this.showModal = true;
  }

  closeMapSettingsModal() {
    this.showModal = false;
  }


  onMouseDown(event: MouseEvent) {
    this.mouseService.isMouseDown = true;
    this.mouseService.isRightClick = event.button === 2; // 1: left-click, 2: right-click (MDN Web Docs)
  }

  onMouseUp() {
    this.mouseService.isMouseDown= false;
  }
}
