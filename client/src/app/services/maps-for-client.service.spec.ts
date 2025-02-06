import { TestBed } from '@angular/core/testing';
import { MapsForClientService } from './maps-for-client.service';
import { ClientHttpRequestsService } from './client-http-requests.service';
import { of, throwError } from 'rxjs';
import { Map } from '@common/map';

fdescribe('MapsForClientService', () => {
  let service: MapsForClientService;
  let httpService: jasmine.SpyObj<ClientHttpRequestsService>;

  const mockMap: Map = {
    id: 1,
    name: 'Test Map',
    size: 10,
    isVisible: true,
    description: 'Test',
    gameMode: 'Classic',
    tileMatrix: [],
    lastModified: new Date(),
    previewImage: ''
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ClientHttpRequestsService', ['getMaps', 'getAllMapsByVisibility']);
    TestBed.configureTestingModule({
      providers: [
        MapsForClientService,
        { provide: ClientHttpRequestsService, useValue: spy }
      ]
    });
    service = TestBed.inject(MapsForClientService);
    httpService = TestBed.inject(ClientHttpRequestsService) as jasmine.SpyObj<ClientHttpRequestsService>;
  });

  it('should load maps successfully', () => {
    httpService.getMaps.and.returnValue(of([mockMap]));
    service.loadMaps();

    expect(service.loading).toBeFalse();
    expect(service.error).toBeNull();
    service.maps$.subscribe(maps => {
      expect(maps).toEqual([mockMap]);
    });
  });

  it('should handle loadMaps error', () => {
    httpService.getMaps.and.returnValue(throwError(() => new Error()));
    service.loadMaps();

    expect(service.loading).toBeFalse();
    expect(service.error).toBe('Failed to load games. Please try again.');
  });

  it('should load maps by visibility successfully', () => {
    httpService.getAllMapsByVisibility.and.returnValue(of([mockMap]));
    service.loadMapsByVisibility();

    expect(service.loading).toBeFalse();
    expect(service.error).toBeNull();
    service.maps$.subscribe(maps => {
      expect(maps).toEqual([mockMap]);
    });
  });

  it('should handle loadMapsByVisibility error', () => {
    httpService.getAllMapsByVisibility.and.returnValue(throwError(() => new Error()));
    service.loadMapsByVisibility();

    expect(service.loading).toBeFalse();
    expect(service.error).toBe('Failed to load games');
  });

  it('should change selected map', () => {
    service.changeSelectedMap(mockMap);
    expect(service.selectedMap).toEqual(mockMap);

    service.changeSelectedMap(null);
    expect(service.selectedMap).toBeNull();
  });

  it('should change clicked map', () => {
    service.changeClickedMap(mockMap);
    expect(service.clickedMap).toEqual(mockMap);

    service.changeClickedMap(null);
    expect(service.clickedMap).toBeNull();
  });
});