import { Component } from '@angular/core';

@Component({
  selector: 'app-save-button',
  imports: [],
  templateUrl: './save-button.component.html',
  styleUrl: './save-button.component.scss'
})
export class SaveButtonComponent {

  save() {
    console.log('Save button clicked');
    // call mapService to save the map
  }

}
