import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MapService } from '@app/services/map.service';

@Component({
    selector: 'app-save-button',
    imports: [],
    templateUrl: './save-button.component.html',
    styleUrl: './save-button.component.scss',
})
export class SaveButtonComponent {
    constructor(
        protected mapService: MapService,
        private router: Router,
    ) {}

    async saveMap() {
        await this.mapService.saveMap();
        this.router.navigate(['admin']);
    }
}
