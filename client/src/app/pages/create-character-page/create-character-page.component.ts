import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfilePictureComponent } from '@app/components/create-character/profile-picture/profile-picture.component';
import { ProfileShowcaseComponent } from '@app/components/create-character/profile-showcase/profile-showcase.component';

@Component({
    selector: 'app-create-character-page',
    imports: [RouterLink, ProfilePictureComponent, ProfileShowcaseComponent],
    templateUrl: './create-character-page.component.html',
    styleUrl: './create-character-page.component.scss',
})
export class CreateCharacterPageComponent {}
