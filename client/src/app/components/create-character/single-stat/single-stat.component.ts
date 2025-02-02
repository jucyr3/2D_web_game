import { Component, Input } from '@angular/core';

const DEFAULT_STAT_VALUE = 4;

@Component({
    selector: 'app-single-stat',
    imports: [],
    templateUrl: './single-stat.component.html',
    styleUrl: './single-stat.component.scss',
})
export class SingleStatComponent {
    @Input() statName: string = 'MonNom';
    @Input() statValue: number = DEFAULT_STAT_VALUE;
    @Input() isDiceSix?: boolean = false;
    @Input() showDice: boolean = false;
    d4 = 'assets/images/d4_dice.png';
    d6 = 'assets/images/d6_dice.png';
}
