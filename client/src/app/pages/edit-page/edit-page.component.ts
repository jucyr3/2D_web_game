import { TileGridComponent } from '@app/components/tile-grid/tile-grid.component';
import { EditingToolService } from '@app/services/editing-tool.service';
import { BrushGridComponent } from "../../components/brush-grid/brush-grid.component";
import { MouseService } from '@app/services/mouse.service';
import { MapService } from '@app/services/map.service';
import { ItemGridComponent } from '@app/components/item-grid/item-grid.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-page',
  imports: [TileGridComponent, BrushGridComponent, ItemGridComponent],
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss',
  providers: [EditingToolService]
})
export class EditPageComponent {
  title = this.mapService.map.name;
  description = this.mapService.map.description;

  constructor (private readonly mouseService: MouseService, protected mapService: MapService) { }



  onMouseDown(event: MouseEvent) {
    this.mouseService.isMouseDown = true;
    this.mouseService.isRightClick = event.button === 2; // 1: left-click, 2: right-click (MDN Web Docs)
  }

  onMouseUp() {
    this.mouseService.isMouseDown= false;
  }

  onMouseMove(event: MouseEvent) {
  }


  onTitleInput(event: Event) {
    this.title = (event.target as HTMLInputElement).value;
  }

  onDescriptionInput(event: Event) {
    this.description = (event.target as HTMLInputElement).value;
  }

  onBlur() {
    this.updateValue();
  }

  updateValue() {
    if (!this.title || this.title.trim() === '') {
      this.title = 'Untitled'; // Reset to default if empty
    }
    this.mapService.map.name = this.title;
    this.mapService.map.description = this.description;
    console.log(this.mapService.map.description);
    // Add any additional logic you need to handle the updated value
  }
}


// TODO: make the cursor a hand when dragging an item
// TODO: make the hovered tile a different color when dragging an item over it
// TODO: make click to delete item
// TODO: when item is not in container, it needs to stay grayed out and not be draggable
// TODO: replace the ItemId with the GameObject in Item component
// TODO: add description to ItemObject
// TODO: Remove the reference do "document" throughout the code