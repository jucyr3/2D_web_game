import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-button',
  imports: [],
  templateUrl: './reset-button.component.html',
  styleUrl: './reset-button.component.scss'
})
export class ResetButtonComponent {

  reset() {
    console.log('Reset button clicked');
    if (confirm('Are you sure you want to reset?')) {  // could be a custom modal
      // proceed with reset logic
      // call mapService to reset the map
      console.log('Resetting map');
    } 
    else {
      console.log('Reset cancelled');
      return;
    }


  }

}
