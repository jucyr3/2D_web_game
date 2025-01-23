import { Component } from '@angular/core';
import { MapService } from '@app/services/map.service';

@Component({
  selector: 'app-description',
  imports: [],
  templateUrl: './description.component.html',
  styleUrl: './description.component.scss'
})
export class DescriptionComponent {

  constructor(protected mapService: MapService) {}

  description = this.mapService.map.description;

  onDescriptionInput(event: Event) {
    this.description = (event.target as HTMLInputElement).value;
  }

  onBlur() {
    this.updateValue();

  }

  updateValue() {
    if (!this.description || this.description.trim() === '') {
        this.description = ''; // Reset to default if empty
    }
    this.mapService.map.description = this.description;
    console.log(this.mapService.map.description); 
      
} 


}
