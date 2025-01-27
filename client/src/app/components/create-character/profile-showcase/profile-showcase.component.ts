import { Component } from '@angular/core';
import { DiceComponent } from '@app/components/create-character/dice/dice.component';
import { NameComponent } from '@app/components/create-character/name/name.component';
import { StatComponent } from '@app/components/create-character/stat/stat.component';
import { ProfileService } from '@app/services/profile.service';

@Component({
    selector: 'app-profile-showcase',
    imports: [DiceComponent, NameComponent, StatComponent],
    templateUrl: './profile-showcase.component.html',
    styleUrl: './profile-showcase.component.scss',
})
export class ProfileShowcaseComponent {
    bonus: boolean = false;
    dice: boolean = false;
    selectedImage:string = this.profileService.showImageSelected();

    clickBonus(event: boolean) {
        this.bonus = event;
    }
    clickDice(event: boolean) {
        this.dice = event;
    }
    constructor(public profileService: ProfileService) {}
}
