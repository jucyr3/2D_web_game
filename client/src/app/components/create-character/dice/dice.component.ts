import { Component } from '@angular/core';

@Component({
    selector: 'app-dice',
    imports: [],
    templateUrl: './dice.component.html',
    styleUrl: './dice.component.scss',
})
export class DiceComponent {
    dice1 = 'assets/images/dice1.png';
    dice2 = 'assets/images/dice2.png';
    clickDice() {
        [this.dice1, this.dice2] = [this.dice2, this.dice1];
    }
}
