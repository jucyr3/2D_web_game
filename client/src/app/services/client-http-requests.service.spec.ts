import { TestBed } from '@angular/core/testing';

import { ClientHttpRequestsService } from './client-http-requests.service';

describe('ClientHttpRequestsService', () => {
  let service: ClientHttpRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientHttpRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
