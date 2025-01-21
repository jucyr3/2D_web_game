import { TileGridComponent } from '@app/components/tile-grid/tile-grid.component';
import { EditingToolService } from '@app/services/editing-tool.service';
import { BrushGridComponent } from "../../components/brush-grid/brush-grid.component";
import { MouseService } from '@app/services/mouse.service';
import { MapSettingsModalComponent} from "../../components/map-settings-modal/map-settings-modal.component";
import { MapService } from '@app/services/map.service';
import { ItemGridComponent } from '@app/components/item-grid/item-grid.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-page',
  imports: [TileGridComponent, BrushGridComponent, MapSettingsModalComponent, ItemGridComponent],
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss',
  providers: [EditingToolService]
})
export class EditPageComponent {
  showModal: boolean = false;

  constructor (private readonly mouseService: MouseService, protected mapService: MapService) { }


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
    const existingSword = document.querySelector('.cursor-sword');
      if (existingSword) {
          existingSword.remove();
      }
    this.mouseService.isMouseDown= false;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.mouseService.isMouseDown) {
        return;
    }
    const sword = document.createElement('img');
    sword.src = '../assets/sword.png';
    sword.style.position = 'fixed';
    sword.style.left = (event.clientX - 16) + 'px';  // Subtract half the width (32/2)
    sword.style.top = (event.clientY - 16) + 'px';   // Subtract half the height (32/2)
    sword.style.width = '32px';
    sword.style.height = '32px';
    sword.style.pointerEvents = 'none';
    
    const existingSword = document.querySelector('.cursor-sword');
    if (existingSword) {
        existingSword.remove();
    }
    
    sword.classList.add('cursor-sword');
    document.body.appendChild(sword);
  }
}
