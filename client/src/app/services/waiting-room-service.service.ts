import { Injectable } from '@angular/core';
import { waitRoomConstants } from '@app/constants/waitRoomConstants';

@Injectable({
    providedIn: 'root',
})
export class WaitingRoomService {
    private readonly minValue = waitRoomConstants.minValue;
    private readonly range = waitRoomConstants.range;

    getRandomFourDigitNumber(): number {
        const randomNumber = Math.floor(this.minValue + Math.random() * this.range);
        return randomNumber;
    }
}
