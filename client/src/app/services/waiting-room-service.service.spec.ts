import { TestBed } from '@angular/core/testing';

import { WaitingRoomServiceService } from './waiting-room-service.service';

describe('WaitingRoomServiceService', () => {
  let service: WaitingRoomServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaitingRoomServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a random number between 1000 and 9999', () => {
    const randomNumber = service.getRandomFourDigitNumber();
    expect(randomNumber).toBeGreaterThanOrEqual(1000);
    expect(randomNumber).toBeLessThanOrEqual(9999);
  });

  it('should generate a different random number on multiple calls', () => {
    const number1 = service.getRandomFourDigitNumber();
    const number2 = service.getRandomFourDigitNumber();
    expect(number1).not.toEqual(number2);
  });
});
