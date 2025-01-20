import { Component } from '@angular/core';
import { ProfileSelectionComponent } from '@app/components/create-character/profile-selection/profile-selection.component';
import { ProfileShowcaseComponent } from '@app/components/create-character/profile-showcase/profile-showcase.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-create-character-page',
    imports: [ProfileSelectionComponent, ProfileShowcaseComponent, RouterLink],
    styleUrl: './create-character-page.component.scss',
    templateUrl: './create-character-page.component.html',
})
export class CreateCharacterPageComponent {
    profilePicture: number = 1;

    choose: boolean = false;
    chosed(value: boolean) {
        this.choose = value;
    }
    handleEvent(event: number) {
        this.profilePicture = event;
    }
}
