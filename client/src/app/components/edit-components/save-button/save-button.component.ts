import { Component } from '@angular/core';
import { MapService } from '@app/services/edit-services/map.service';

@Component({
    selector: 'app-save-button',
    templateUrl: './save-button.component.html',
    styleUrl: './save-button.component.scss',
})
export class SaveButtonComponent {
    constructor(
        protected mapService: MapService,
    ) {}

    async saveMap() {
        await this.mapService.saveMap();
    }
}
