import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClientHttpRequestsService } from '@app/services/client-http-requests.service';
import { MapService } from '@app/services/map.service';
import { Map } from '@common/map';

@Component({
  selector: 'app-game-actions',
  imports: [],
  templateUrl: './game-actions.component.html',
  styleUrl: './game-actions.component.scss'
})

export class GameActionsComponent {
  @Input() map: Map;
  @Output() refresh = new EventEmitter<void>();
  
  constructor(protected clientHttpRequest: ClientHttpRequestsService, protected mapService: MapService, private router: Router) {}
  
  toggleVisibility(map: Map) {
    this.clientHttpRequest.updateMapVisibility(map.id, !map.isVisible).subscribe({
        next: (updatedMap) => {
          this.refresh.emit(); 
        },
        error: (error) => {
            console.error('Error updating game visibility:', error);
        }
    });
  }

  editMap(map: Map) {
    this.clientHttpRequest.loadMapById(map.id).subscribe({
        next: (map: Map) => {
          this.mapService.loadMap(this.mapService.loadMapFromJSON(map)); 
          this.router.navigate(['edit', map.id]);
        
        },
        error: (err) => {
          console.error('Error loading map:', err);
        },
      });
  }

  deleteMap(map: Map) { 
    if (confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
        this.clientHttpRequest.deleteMap(map.id).subscribe({
            next: () => { this.refresh.emit(); 
            },
            error: (error) => {
                console.error('Error deleting game:', error);
            }
        });
    }
  }

}
