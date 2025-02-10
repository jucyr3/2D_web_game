import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GameInfoComponent } from '@app/components/admin-game/game-info/game-info.component';
import { PreviewContainerComponent } from '@app/components/admin-game/preview-container/preview-container.component';
import { MapsForClientService } from '@app/services/maps-for-client.service';

@Component({
    selector: 'app-maps-grid',
    imports: [CommonModule, PreviewContainerComponent, GameInfoComponent],
    templateUrl: './maps-grid.component.html',
    styleUrl: './maps-grid.component.scss',
})
export class MapsGridComponent implements OnInit {
    constructor(protected mapsForClientService: MapsForClientService) {}

    ngOnInit(): void {
        this.onRefresh();
    }

    onRefresh(): void {
        this.mapsForClientService.loadMapsByVisibility();
        this.mapsForClientService.changeClickedMap(null);
    }
}
