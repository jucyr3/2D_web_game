import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ClientHttpRequestsService } from './client-http-requests.service';
import { environment } from 'src/environments/environment';
import { Map } from '@common/map';
import { MapResponse } from '@common/mapResponse';
import { MapVerification } from '@common/mapVerification.interface';

describe('ClientHttpRequestsService', () => {
    let service: ClientHttpRequestsService;
    let httpMock: HttpTestingController;

    // Helper function to create a mock map verification
    const createMockMapVerification = (overrides: Partial<MapVerification> = {}): MapVerification => ({
        isUniqueName: true,
        isNamePresent: true,
        isDescriptionPresent: true,
        isMapHalfFloor: true,
        isMapAccessible: true,
        areStartingPointsValid: true,
        areDoorsNextToWalls: true,
        areDoorsNotNextToBorder: true,
        isNameValid: true,
        isDescriptionValid: true,
        ...overrides,
    });

    // Helper function to create a mock map
    const createMockMap = (id: number, name: string): Map => ({
        id,
        name,
        size: 10, // Example size
        isVisible: true,
        description: `Description for ${name}`,
        gameMode: 'Classic',
        tileMatrix: [], // Empty array
        lastModified: new Date(),
        previewImage: 'base64-encoded-image',
    });

    // Helper function to create a mock map response
    const createMockMapResponse = (id: number, verificationOverrides: Partial<MapVerification> = {}): MapResponse => ({
        id,
        mapVerification: createMockMapVerification(verificationOverrides),
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ClientHttpRequestsService, provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(ClientHttpRequestsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getMaps', () => {
        it('should return an array of maps', () => {
            const mockMaps: Map[] = [createMockMap(1, 'Test Map 1'), createMockMap(2, 'Test Map 2')];

            service.getMaps().subscribe((maps) => {
                expect(maps.length).toBe(2);
                expect(maps[0].name).toBe('Test Map 1');
                expect(maps[0].tileMatrix).toEqual([]);
            });

            const req = httpMock.expectOne(`${environment.serverUrl}/maps`);
            expect(req.request.method).toBe('GET');
            req.flush(mockMaps);
        });

        it('should handle single map response', () => {
            const mockMap = createMockMap(1, 'Single Map');

            service.getMaps().subscribe((maps) => {
                expect(maps.length).toBe(1);
                expect(maps[0].name).toBe('Single Map');
                expect(maps[0].gameMode).toBe('Classic');
            });

            const req = httpMock.expectOne(`${environment.serverUrl}/maps`);
            expect(req.request.method).toBe('GET');
            req.flush(mockMap);
        });

        it('should handle single map response when getting visible maps', () => {
            const mockMap = createMockMap(1, 'Single Visible Map');

            service.getAllMapsByVisibility().subscribe((maps) => {
                expect(maps.length).toBe(1);
                expect(maps[0].name).toBe('Single Visible Map');
                expect(maps[0].gameMode).toBe('Classic');
                expect(maps[0].isVisible).toBe(true);
            });

            const req = httpMock.expectOne(`${environment.serverUrl}/maps/visibility/isVisible`);
            expect(req.request.method).toBe('GET');
            req.flush(mockMap);
        });
    });

    describe('loadMapById', () => {
        it('should return a specific map by ID', () => {
            const mockMap = createMockMap(1, 'Specific Map');
            const mapSize = 10;

            service.loadMapById(1).subscribe((map) => {
                expect(map.id).toBe(1);
                expect(map.name).toBe('Specific Map');
                expect(map.size).toBe(mapSize);
                expect(map.gameMode).toBe('Classic');
                expect(map.tileMatrix).toEqual([]);
            });

            const req = httpMock.expectOne(`${environment.serverUrl}/maps/1`);
            expect(req.request.method).toBe('GET');
            req.flush(mockMap);
        });
    });

    describe('saveMapToServer', () => {
        it('should save a map and return MapResponse with full validation', () => {
            const mapToSave = createMockMap(0, 'New Map');
            const mockResponse = createMockMapResponse(1);

            service.saveMapToServer(mapToSave).subscribe((response) => {
                expect(response.id).toBe(1);
                expect(response.mapVerification).toBeDefined();

                // Verify all validation properties
                expect(response.mapVerification.isUniqueName).toBeTrue();
                expect(response.mapVerification.isNamePresent).toBeTrue();
                expect(response.mapVerification.isDescriptionPresent).toBeTrue();
                expect(response.mapVerification.isMapHalfFloor).toBeTrue();
                expect(response.mapVerification.isMapAccessible).toBeTrue();
                expect(response.mapVerification.areStartingPointsValid).toBeTrue();
                expect(response.mapVerification.areDoorsNextToWalls).toBeTrue();
                expect(response.mapVerification.areDoorsNotNextToBorder).toBeTrue();
                expect(response.mapVerification.isNameValid).toBeTrue();
                expect(response.mapVerification.isDescriptionValid).toBeTrue();
            });

            const req = httpMock.expectOne(`${environment.serverUrl}/maps`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mapToSave);
            req.flush(mockResponse);
        });

        it('should handle map verification failures', () => {
            const mapToSave = createMockMap(0, 'Invalid Map');
            const mockResponse = createMockMapResponse(1, {
                isUniqueName: false,
                isNamePresent: false,
                isMapAccessible: false,
            });

            service.saveMapToServer(mapToSave).subscribe((response) => {
                expect(response.id).toBe(1);
                expect(response.mapVerification.isUniqueName).toBeFalse();
                expect(response.mapVerification.isNamePresent).toBeFalse();
                expect(response.mapVerification.isMapAccessible).toBeFalse();
            });

            const req = httpMock.expectOne(`${environment.serverUrl}/maps`);
            expect(req.request.method).toBe('POST');
            req.flush(mockResponse);
        });
    });

    describe('getAllMapsByVisibility', () => {
        it('should return visible maps', () => {
            const mockVisibleMaps: Map[] = [createMockMap(1, 'Visible Map 1'), createMockMap(2, 'Visible Map 2')];

            service.getAllMapsByVisibility().subscribe((maps) => {
                expect(maps.length).toBe(2);
                expect(maps.every((map) => map.isVisible)).toBeTrue();
                expect(maps[0].gameMode).toBe('Classic');
            });

            const req = httpMock.expectOne(`${environment.serverUrl}/maps/visibility/isVisible`);
            expect(req.request.method).toBe('GET');
            req.flush(mockVisibleMaps);
        });
    });

    describe('updateMapVisibility', () => {
        it('should update map visibility', () => {
            const mockMap = createMockMap(1, 'Test Map');
            mockMap.isVisible = false;

            service.updateMapVisibility(1, false).subscribe((map) => {
                expect(map.id).toBe(1);
                expect(map.isVisible).toBeFalse();
            });

            const req = httpMock.expectOne(`${environment.serverUrl}/maps/1/isVisible`);
            expect(req.request.method).toBe('PATCH');
            expect(req.request.body).toEqual({ isVisible: false });
            req.flush(mockMap);
        });
    });

    describe('saveMapImageOnServer', () => {
        it('should save map preview image', () => {
            const mockMap = createMockMap(1, 'Map with Image');
            const base64Image = 'data:image/png;base64,testimage';
            mockMap.previewImage = base64Image;

            service.saveMapImageOnServer(1, base64Image).subscribe((map) => {
                expect(map.id).toBe(1);
                expect(map.previewImage).toBe(base64Image);
            });

            const req = httpMock.expectOne(`${environment.serverUrl}/maps/1/previewImage`);
            expect(req.request.method).toBe('PATCH');
            expect(req.request.body).toEqual({ previewImage: base64Image });
            req.flush(mockMap);
        });
    });

    describe('deleteMap', () => {
        it('should delete a map by ID', () => {
            service.deleteMap(1).subscribe(() => {
                // Successful deletion
            });

            const req = httpMock.expectOne(`${environment.serverUrl}/maps/1`);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);
        });
    });
});
