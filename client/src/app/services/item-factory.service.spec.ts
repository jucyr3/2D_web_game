import { TestBed } from '@angular/core/testing';

import { ItemFactoryService } from './item-factory.service';

describe('ItemFactoryService', () => {
  let service: ItemFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
