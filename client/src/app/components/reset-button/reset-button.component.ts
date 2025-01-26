import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-button',
  imports: [],
  templateUrl: './reset-button.component.html',
  styleUrl: './reset-button.component.scss'
})
export class ResetButtonComponent {

  reset() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser ?')) {  // pourrait être une fenêtre modale personnalisée
      // procéder à la logique de réinitialisation
      // appeler mapService pour réinitialiser la carte
    } 
    else {
      return;
    }


  }

}
