import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { MapsForClientService } from '@app/services/maps-for-client.service';
import { GameActionsComponent } from '@app/components/admin-game/game-actions/game-actions.component';
import { GameInfoComponent } from '@app/components/admin-game/game-info/game-info.component';
import { PreviewContainerComponent } from '@app/components/admin-game/preview-container/preview-container.component';

@Component({
    selector: 'app-games-grid',
    imports: [PreviewContainerComponent, GameInfoComponent, GameActionsComponent, CommonModule],
    templateUrl: './games-grid.component.html',
    styleUrl: './games-grid.component.scss',
})
export class GameGridComponent implements AfterViewInit {
    constructor(protected mapsForClientService: MapsForClientService) {}

    ngAfterViewInit(): void {
        this.onRefresh();
    }

    onRefresh(): void {
        this.mapsForClientService.loadMaps();
    }
}
