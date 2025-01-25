import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProfileSelectionComponent } from '@app/components/create-character/profile-selection/profile-selection.component';
import { ProfileShowcaseComponent } from '@app/components/create-character/profile-showcase/profile-showcase.component';
import { ProfileService } from '@app/services/profile.service';

@Component({
    selector: 'app-create-character-page',
    imports: [ProfileSelectionComponent, ProfileShowcaseComponent, RouterLink],
    styleUrl: './create-character-page.component.scss',
    templateUrl: './create-character-page.component.html',
})
export class CreateCharacterPageComponent {
    verifyCreation() {
        if (this.profileService.getName()) {
            this.router.navigate(['/waitingRoom']);
        }
    }

    constructor(
        private profileService: ProfileService,
        private router: Router,
    ) {}
}
