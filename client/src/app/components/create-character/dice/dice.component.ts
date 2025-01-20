import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-dice',
    imports: [],
    templateUrl: './dice.component.html',
    styleUrl: './dice.component.scss',
})
export class DiceComponent {
    @Output() selected = new EventEmitter<boolean>();
    dice1 = 'assets/images/dice1.png';
    dice2 = 'assets/images/dice2.png';
    cahnge: boolean = false;
    clickDice() {
        this.cahnge = !this.cahnge;
        [this.dice1, this.dice2] = [this.dice2, this.dice1];
        this.selected.emit(this.cahnge);
    }
}
