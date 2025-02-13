import { TestBed } from '@angular/core/testing';
import { Map } from '@common/map';
import { of } from 'rxjs';
import { ClientHttpRequestsService } from './client-http-requests.service';
import { MapsForClientService } from './maps-for-client.service';

describe('MapsForClientService', () => {
    let service: MapsForClientService;
    let httpService: jasmine.SpyObj<ClientHttpRequestsService>;

    const mockMap: Map = {
        mapId: '1',
        name: 'Test Map',
        size: 10,
        isVisible: true,
        description: 'Test',
        gameMode: 'Classic',
        tileMatrix: [],
        lastModified: new Date(),
        previewImage: '',
    };

    beforeEach(() => {
        const spy = jasmine.createSpyObj('ClientHttpRequestsService', ['getMaps', 'getAllMapsByVisibility']);
        TestBed.configureTestingModule({
            providers: [MapsForClientService, { provide: ClientHttpRequestsService, useValue: spy }],
        });
        service = TestBed.inject(MapsForClientService);
        httpService = TestBed.inject(ClientHttpRequestsService) as jasmine.SpyObj<ClientHttpRequestsService>;
    });

    it('should load maps successfully', () => {
        httpService.getMaps.and.returnValue(of([mockMap]));
        service.loadMaps();

        expect(service.loading).toBeFalse();
        expect(service.error).toBeNull();
        service.maps$.subscribe((maps) => {
            expect(maps).toEqual([mockMap]);
        });
    });

    it('should load maps by visibility successfully', () => {
        httpService.getAllMapsByVisibility.and.returnValue(of([mockMap]));
        service.loadMapsByVisibility();

        expect(service.loading).toBeFalse();
        expect(service.error).toBeNull();
        service.mapsVisible$.subscribe((maps) => {
            expect(maps).toEqual([mockMap]);
        });
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
