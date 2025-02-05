import { Component } from '@angular/core';
import { MapService } from '@app/services/map.service';

@Component({
    selector: 'app-reset-button',
    templateUrl: './reset-button.component.html',
    styleUrl: './reset-button.component.scss',
})
export class ResetButtonComponent {
    constructor(private readonly mapService: MapService) {}

    reset() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser ?')) {
            this.mapService.resetMap();
        }
    }
}
