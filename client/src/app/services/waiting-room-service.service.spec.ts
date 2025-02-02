import { TestBed } from '@angular/core/testing';

import { WaitingRoomService } from './waiting-room-service.service';
import { waitRoomConstants } from '@app/constants/waitRoomConstants';
describe('WaitingRoomService', () => {
    let service: WaitingRoomService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WaitingRoomService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should generate a random number between 1000 and 9999', () => {
        const randomNumber = service.getRandomFourDigitNumber();
        expect(randomNumber).toBeGreaterThanOrEqual(waitRoomConstants.minValue);
        expect(randomNumber).toBeLessThanOrEqual(waitRoomConstants.maxValue);
    });

    it('should generate a different random number on multiple calls', () => {
        const number1 = service.getRandomFourDigitNumber();
        const number2 = service.getRandomFourDigitNumber();
        expect(number1).not.toEqual(number2);
    });
});
