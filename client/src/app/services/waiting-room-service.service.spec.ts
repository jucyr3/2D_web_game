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
});
