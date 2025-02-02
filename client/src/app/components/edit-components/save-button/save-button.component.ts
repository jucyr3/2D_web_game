import { Component } from '@angular/core';
import { MapService } from '@app/services/map.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-save-button',
  imports: [],
  templateUrl: './save-button.component.html',
  styleUrl: './save-button.component.scss'
})
export class SaveButtonComponent {
  constructor(protected mapService: MapService, private router: Router){}
  
  async saveMap(){ // TODO : CHANGE FOR MERGING WITH VINCENT
    await this.mapService.saveMap();
    this.router.navigate(['admin']);
  }
}
