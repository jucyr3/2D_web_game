import { TestBed } from '@angular/core/testing';

import { WaitingRoomService } from './waiting-room-service.service';

describe('WaitingRoomService', () => {
    let service: WaitingRoomService;
    const MIN_VALUE = 1000;
    const MAX_VALUE = 9999;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WaitingRoomService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should generate a random number between 1000 and 9999', () => {
        const randomNumber = service.getRandomFourDigitNumber();
        expect(randomNumber).toBeGreaterThanOrEqual(MIN_VALUE);
        expect(randomNumber).toBeLessThanOrEqual(MAX_VALUE);
    });

    it('should generate a different random number on multiple calls', () => {
        const number1 = service.getRandomFourDigitNumber();
        const number2 = service.getRandomFourDigitNumber();
        expect(number1).not.toEqual(number2);
    });
});
