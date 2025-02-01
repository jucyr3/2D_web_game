import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WaitingRoomServiceService {
    private readonly MIN_VALUE = 1000;
    private readonly RANGE = 9000;
    getRandomFourDigitNumber(): number {
        const randomNumber= Math.floor(this.MIN_VALUE + Math.random() * this.RANGE);
        return randomNumber;
    }
}
