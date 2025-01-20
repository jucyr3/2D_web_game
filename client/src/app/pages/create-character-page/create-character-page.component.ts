import { Component } from '@angular/core';
import { ProfileSelectionComponent } from '@app/components/create-character/profile-selection/profile-selection.component';
import { ProfileShowcaseComponent } from '@app/components/create-character/profile-showcase/profile-showcase.component';

@Component({
    selector: 'app-create-character-page',
    imports: [ProfileSelectionComponent, ProfileShowcaseComponent],
    templateUrl: './create-character-page.component.html',
    styleUrl: './create-character-page.component.scss',
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
