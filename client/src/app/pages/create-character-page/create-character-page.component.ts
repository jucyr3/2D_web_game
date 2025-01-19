import { Component } from '@angular/core';
import { ProfileSelectionComponent } from '@app/components/create-character/profile-selection/profile-selection.component';
import { ProfileShowcaseComponent } from '@app/components/create-character/profile-showcase/profile-showcase.component';

@Component({
    selector: 'app-create-character-page',
    imports: [ ProfileSelectionComponent, ProfileShowcaseComponent],
    templateUrl: './create-character-page.component.html',
    styleUrl: './create-character-page.component.scss',
})
export class CreateCharacterPageComponent {}
