import { Component } from '@angular/core';
import { ProfilePictureComponent } from '@app/components/create-character/profile-picture/profile-picture.component';
import { ProfileService } from '@app/services/profile.service';

@Component({
    selector: 'app-profile-selection',
    imports: [ProfilePictureComponent],
    templateUrl: './profile-selection.component.html',
    styleUrl: './profile-selection.component.scss',
})
export class ProfileSelectionComponent {
    get imagesPath() {
        return this.profileService.imagesPath;
    }
    get itemSelected() {
        return this.profileService.getSelectedItem();
    }
    clickItem(event: number) {
        this.profileService.setSelectedItem(event);
    }
    constructor(private profileService: ProfileService) {}
}
