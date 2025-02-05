import { Component } from '@angular/core';
import { MapService } from '@app/services/map.service';

@Component({
    selector: 'app-save-button',
    templateUrl: './save-button.component.html',
    styleUrl: './save-button.component.scss',
})
export class SaveButtonComponent {
    constructor(private readonly mapService: MapService) {}

    save() {
        this.mapService.saveMap();
    }
}
