import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameGridComponent } from '@app/components/admin-game/games-grid/games-grid/games-grid.component';
import { ModalComponent } from '@app/components/admin-game/modal/modal.component';
import { MapService } from '@app/services/map.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
    imports: [CommonModule, FormsModule, GameGridComponent, ModalComponent],
    standalone: true
})

export class AdminPageComponent {
    constructor(protected router: Router, protected mapService: MapService) {}

    isCreateModalOpen = false;
    newMapForm = {
        mapName: '',  
        mapMode: 'CLASSIQUE' as 'CLASSIQUE' | 'CAPTURE THE FLAG',
        mapSize: 'PETIT' as 'PETIT' | 'MOYENNE' | 'GRANDE'
    };

    openCreateModal() {
        this.isCreateModalOpen = true;
    }
    
    closeCreateModal() {
        this.isCreateModalOpen = false;
    }

    handleCreateMap(formData: any) { // Creates empty map service
        const mapData = {
          name: formData.mapName,
          gameMode: formData.mapMode,
          size: formData.mapSize === 'PETIT' ? '10' : 
                formData.mapSize === 'MOYENNE' ? '15' : '20'
        };
    
        this.mapService.createEmptyMap(mapData);
        this.router.navigate(['edit']);
        this.closeCreateModal();
    }
}