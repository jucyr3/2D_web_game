import { Test, TestingModule } from '@nestjs/testing';
import { MapDbService } from './map-db.service';

describe('MapDbService', () => {
  let service: MapDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapDbService],
    }).compile();

    service = module.get<MapDbService>(MapDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
