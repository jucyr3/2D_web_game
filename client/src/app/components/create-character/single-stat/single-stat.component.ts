import { Component, Input } from '@angular/core';
import { characterConstants } from '@app/constants/characterConstants';

const DEFAULT_STAT_VALUE = 4;

@Component({
    selector: 'app-single-stat',
    templateUrl: './single-stat.component.html',
    styleUrl: './single-stat.component.scss',
})
export class SingleStatComponent {
    @Input() statName: string = 'MonNom';
    @Input() statValue: number = DEFAULT_STAT_VALUE;
    @Input() isDiceSix?: boolean = false;
    @Input() showDice: boolean = false;
    d4 = characterConstants.d4Path;
    d6 = characterConstants.d6Path;
}
