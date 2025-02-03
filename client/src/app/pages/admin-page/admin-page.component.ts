import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameGridComponent } from '@app/components/admin-game/games-grid/games-grid/games-grid.component';
import { ModalComponent } from '@app/components/admin-game/modal/modal.component';
import { MapService } from '@app/services/map.service';
import { MapsForClientService } from '@app/services/maps-for-client.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
    imports: [CommonModule, FormsModule, GameGridComponent, ModalComponent],
    standalone: true,
})
export class AdminPageComponent {
    constructor(
        protected router: Router,
        protected mapService: MapService,
        protected mapsForClientService: MapsForClientService,
        readonly dialog: MatDialog,
    ) {}

    isCreateModalOpen = false;
    newMapForm = {
        mapName: '',
        mapMode: 'Classic' as 'Classic' | 'CTF',
        mapSize: 'PETITE' as 'PETITE' | 'MOYENNE' | 'GRANDE',
    };

    openCreateModal() {
        this.isCreateModalOpen = true;
    }

    closeCreateModal() {
        this.isCreateModalOpen = false;
    }

    handleCreateMap(formData: any): boolean { // TODO : DEVRAIT METTRE DANS UN SERVICE QUI GÈRE LES VERIFS DU MODAL
        if (!formData.mapName?.trim()) {
            alert('Map name cannot be empty');
            return false;
        }
        
        const existingMap = this.mapsForClientService.mapsSubject.getValue().find(
            map => map.name.toLowerCase() === formData.mapName.trim().toLowerCase()
        );
        
        if (existingMap) {
            alert('Map name already exists');
            return false;
        }
    
        const validSizes = ['PETITE', 'MOYENNE', 'GRANDE'];
        if (!validSizes.includes(formData.mapSize)) {
            alert('Invalid map size');
            return false;
        }
    
        const mapData = {
            name: formData.mapName.trim(),
            gameMode: formData.mapMode,
            size: formData.mapSize === 'PETITE' ? '10' : 
                  formData.mapSize === 'MOYENNE' ? '15' : '20',
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
