import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MapsGridComponent } from '@app/components/create-match/maps-grid/maps-grid.component';
import { MapsForClientService } from '@app/services/maps-for-client.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-create-match-page',
    templateUrl: './create-match-page.component.html',
    styleUrls: ['../admin-page/admin-page.component.scss'],
    imports: [CommonModule, FormsModule, MapsGridComponent],
    standalone: true,
})
export class CreateMatchPageComponent {
    constructor(
        protected router: Router,
        protected mapsForClient: MapsForClientService,
    ) {}

    createGame() {
        this.mapsForClient.loadMapsByVisibility();
        this.mapsForClient.maps$.pipe(map((maps) => maps.find((map) => map === this.mapsForClient.clickedMap))).subscribe((existedMap) => {
            if (existedMap) {
                this.router.navigate(['/character']);
            } else {
                this.router.navigate(['/match']).then(() => {
                    setTimeout(() => {
                        alert('La carte fut cachée ou effacée');
                    }, 500);
                });
            }
        });
    }

    onBodyClick(event: MouseEvent): void {
        if (!(event.target as HTMLElement).closest('.game-card') && !(event.target as HTMLElement).closest('button')) {
            this.mapsForClient.clickedMap = null;
        }
    }

    openQuitDialog(): void {
        this.router.navigate(['/home']);
    }
}
