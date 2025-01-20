import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DiceComponent } from '@app/components/create-character/dice/dice.component';
import { NameComponent } from '@app/components/create-character/name/name.component';
import { StatComponent } from '@app/components/create-character/stat/stat.component';

@Component({
    selector: 'app-profile-showcase',
    imports: [DiceComponent, NameComponent, StatComponent],
    templateUrl: './profile-showcase.component.html',
    styleUrl: './profile-showcase.component.scss',
})
export class ProfileShowcaseComponent implements OnChanges {
    @Input() profileChosed: number;
    imagePath: string;
    bonus: boolean = false;
    dice: boolean = false;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['profileChosed']) {
            this.imagePath = 'assets/images/' + this.profileChosed + '.jpg';
        }
    }
    clickBonus(event: boolean) {
        this.bonus = event;
    }
    clickDice(event: boolean) {
        this.dice = event;
    }
}
