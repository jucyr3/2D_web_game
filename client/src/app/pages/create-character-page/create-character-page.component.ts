import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileSelectionComponent } from '@app/components/create-character/profile-selection/profile-selection.component';
import { ProfileShowcaseComponent } from '@app/components/create-character/profile-showcase/profile-showcase.component';
import { ProfileService } from '@app/services/create-character/profile.service';

@Component({
    selector: 'app-create-character-page',
    imports: [ProfileSelectionComponent, ProfileShowcaseComponent],
    styleUrl: './create-character-page.component.scss',
    templateUrl: './create-character-page.component.html',
})
export class CreateCharacterPageComponent {
    constructor(
        private profileService: ProfileService,
        public router: Router,
    ) {}
    verifyCreation() {
        if (this.profileService.getName()) {
            this.router.navigate(['/waitingRoom']);
        } else {
            alert('Veuillez Choisir le nom de votre personnage');
        }
    }
}
