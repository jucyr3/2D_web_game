import { Injectable } from '@angular/core';

const MIN_VALUE = 1000;
const RANGE = 9000;
@Injectable({
    providedIn: 'root',
})
export class WaitingRoomService {
    private readonly minValue = MIN_VALUE;
    private readonly range = RANGE;

    getRandomFourDigitNumber(): number {
        const randomNumber = Math.floor(this.minValue + Math.random() * this.range);
        return randomNumber;
    }
}
