import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClientHttpRequestsService } from '@app/services/client-http-requests.service';
import { MapService } from '@app/services/edit-services/map.service';
import { Map } from '@common/map';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-game-actions',
    imports: [MatIconModule, CommonModule],
    templateUrl: './game-actions.component.html',
    styleUrl: './game-actions.component.scss',
})
export class GameActionsComponent {
    @Input() map: Map;
    @Output() refresh = new EventEmitter<void>();

    constructor(
        private clientHttpRequest: ClientHttpRequestsService,
        private mapService: MapService,
        private router: Router,
    ) {}

    toggleVisibility(map: Map) {
        map.isVisible = !map.isVisible;
        this.clientHttpRequest.updateMapVisibility(map.mapId, map.isVisible).subscribe({
            next: () => {
                this.refresh.emit();
            },
            error: () => {
                alert('Impossible de modifier la visibilité de la carte');
            },
        });
    }

    async editMap(map: Map) {
        await this.mapService.loadMapFromServer(map.mapId);
        this.router.navigate(['edit', map.mapId]);
    }

    deleteMap(map: Map) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
            this.clientHttpRequest.deleteMap(map.mapId).subscribe({
                next: () => {
                    this.refresh.emit();
                },
                error: () => {
                    alert("Impossible d'enlever la carte");
                },
            });
        }
    }
}
