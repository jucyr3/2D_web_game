import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MapsGridComponent } from '@app/components/create-match/maps-grid/maps-grid.component';
import { MapsForClientService } from '@app/services/maps-for-client.service';

@Component({
    selector: 'app-create-match-page',
    templateUrl: './create-match-page.component.html',
    styleUrls: ['../admin-page/admin-page.component.scss'],
    imports: [CommonModule, FormsModule, MapsGridComponent],
    standalone: true
})
export class CreateMatchPageComponent { // TODO : SERVER DOES NOT SAVE MAP IMAGES LIKE IN ADMIN PAGE 
    constructor(
        protected router: Router, 
        protected mapsForClient: MapsForClientService,
    ) {}

    createGame() {
        console.log(this.mapsForClient.clickedMap?.name);
        this.router.navigate(['/character']);
    }

    onBodyClick(event: MouseEvent): void {
        if (!(event.target as HTMLElement).closest('.game-card') && // TODO : error in console
            !(event.target as HTMLElement).closest('button')) {
            this.mapsForClient.clickedMap = null;
        }
    }

    openQuitDialog(): void {
        this.router.navigate(['/home']);
    }
}