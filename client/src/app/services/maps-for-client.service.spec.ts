import { TestBed } from '@angular/core/testing';

import { MapsForClientService } from './maps-for-client.service';

describe('MapsForClientService', () => {
  let service: MapsForClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapsForClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
