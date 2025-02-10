import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameGridComponent } from '@app/components/admin-game/games-grid/games-grid.component';
import { MapCreationModalComponent } from '@app/components/admin-game/mapCreationModal/mapCreationModal.component';
import { MapService } from '@app/services/edit-services/map.service';
import { MapsForClientService } from '@app/services/maps-for-client.service';
import { MapFormData } from '@app/interfaces/mapFormData';
import { MapProperties } from '@common/map.constants';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
    imports: [CommonModule, FormsModule, GameGridComponent, MapCreationModalComponent],
    standalone: true,
})
export class AdminPageComponent {
    isCreateModalOpen = false;
    mapForm: MapFormData;

    constructor(
        protected router: Router,
        protected mapService: MapService,
        protected mapsForClientService: MapsForClientService,
        readonly dialog: MatDialog,
    ) {}

    openCreateModal() {
        this.isCreateModalOpen = true;
    }

    closeCreateModal() {
        this.isCreateModalOpen = false;
    }


    handleCreateMap(formData: MapFormData): boolean {
        const validSizes = [MapProperties.MAP_SIZE_SMALL, MapProperties.MAP_SIZE_MEDIUM, MapProperties.MAP_SIZE_LARGE];
        if (!validSizes.includes(formData.size)) {
            alert('Invalid map size');
            return false;
        }

        const mapData = {
            gameMode: formData.gameMode,
            size: formData.size,
        };

        try {
            this.mapService.createEmptyMap(mapData);
            this.router.navigate(['edit']);
            this.closeCreateModal();
            return true;
        } catch (error) {
            alert('Failed to create map');
            return false;
        }
    }

    openQuitDialog(): void {
        this.router.navigate(['/home']);
    }
}
