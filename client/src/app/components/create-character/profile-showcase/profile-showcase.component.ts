import { Component } from '@angular/core';
import { DiceComponent } from '@app/components/create-character/dice/dice.component';
import { NameComponent } from '@app/components/create-character/name/name.component';
import { StatComponent } from '@app/components/create-character/stat/stat.component';

@Component({
    selector: 'app-profile-showcase',
    imports: [DiceComponent, NameComponent, StatComponent],
    templateUrl: './profile-showcase.component.html',
    styleUrl: './profile-showcase.component.scss',
})
export class ProfileShowcaseComponent {
    imagePath = 'assets/images/1.jpg';
}
