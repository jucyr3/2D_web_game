import { Component } from '@angular/core';
import { MapService } from '@app/services/map.service';

@Component({
  selector: 'app-title',
  imports: [],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent {

  constructor(protected mapService: MapService) {}

  title = this.mapService.map.name;

  onTitleInput(event: Event) {
    this.title = (event.target as HTMLInputElement).value;
  }

  onBlur() {
    this.updateValue();
  }

  updateValue() {
      if (!this.title || this.title.trim() === '') {
          this.title = 'Untitled'; // Reset to default if empty
      }
      this.mapService.map.name = this.title;
      console.log(this.mapService.map.name); {
        
      }
  }

}
