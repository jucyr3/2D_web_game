import { Component } from '@angular/core';
import { MapService } from '@app/services/edit-services/map.service';
import { LoadingModalService } from '@app/services/loading-modal.service';
import { LoadingModalComponent } from '@app/components/loading-modal/loading-modal.component';

@Component({
    selector: 'app-save-button',
    imports: [LoadingModalComponent],
    templateUrl: './save-button.component.html',
    styleUrl: './save-button.component.scss',
})
export class SaveButtonComponent {
    constructor(
        protected mapService: MapService,
        protected loadingModalService: LoadingModalService,
    ) {}

    async saveMap() {
        this.loadingModalService.isLoading = true;
        await this.mapService.saveMap();
        this.loadingModalService.isLoading = false;
    }
}
