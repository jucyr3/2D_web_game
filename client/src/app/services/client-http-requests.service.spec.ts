import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientHttpRequestsService } from './client-http-requests.service';
import { environment } from 'src/environments/environment';
import { Map } from '@common/map';
import { MapResponse } from '@common/mapResponse';
import { MapVerification } from '@common/mapVerification.interface';

describe('ClientHttpRequestsService', () => {
    let service: ClientHttpRequestsService;
    let httpMock: HttpTestingController;
    const apiUrl = environment.serverUrl;

    const mockMapVerification: MapVerification = {
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
    };

    const mockMap: Map = {
        id: 1,
        name: 'Test Map',
        size: 10,
        isVisible: true,
        description: 'Test Description',
        gameMode: 'CTF',
        tileMatrix: [],
        lastModified: new Date(),
        previewImage: 'test-image',
    };

    const invalidMapVerification: MapVerification = {
        isUniqueName: false,
        isNamePresent: false,
        isDescriptionPresent: false,
        isMapHalfFloor: false,
        isMapAccessible: false,
        areStartingPointsValid: false,
        areDoorsNextToWalls: false,
        areDoorsNotNextToBorder: false,
        isNameValid: false,
        isDescriptionValid: false,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ClientHttpRequestsService],
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
            const mockMaps: Map[] = [mockMap];

            service.getMaps().subscribe((maps) => {
                expect(maps).toEqual(mockMaps);
                expect(maps.length).toBe(1);
            });

            const req = httpMock.expectOne(`${apiUrl}/maps`);
            expect(req.request.method).toBe('GET');
            req.flush(mockMaps);
        });

        it('should handle single map response', () => {
            service.getMaps().subscribe((maps) => {
                expect(maps).toEqual([mockMap]);
                expect(maps.length).toBe(1);
            });

            const req = httpMock.expectOne(`${apiUrl}/maps`);
            expect(req.request.method).toBe('GET');
            req.flush(mockMap);
        });
    });

    describe('loadMapById', () => {
        it('should return a map by id', () => {
            const mapId = 1;

            service.loadMapById(mapId).subscribe((map) => {
                expect(map).toEqual(mockMap);
            });

            const req = httpMock.expectOne(`${apiUrl}/maps/${mapId}`);
            expect(req.request.method).toBe('GET');
            req.flush(mockMap);
        });

        it('should handle non-existent map id', () => {
            const mapId = 999;

            service.loadMapById(mapId).subscribe({
                error: (error) => {
                    expect(error.status).toBe(404);
                },
            });

            const req = httpMock.expectOne(`${apiUrl}/maps/${mapId}`);
            req.flush('Map not found', { status: 404, statusText: 'Not Found' });
        });
    });

    describe('saveMapToServer', () => {
        it('should save valid map and return successful MapResponse', () => {
            const validMapResponse: MapResponse = {
                id: 1,
                mapVerification: mockMapVerification,
            };

            service.saveMapToServer(mockMap).subscribe((response) => {
                expect(response).toEqual(validMapResponse);
                expect(response.mapVerification.isUniqueName).toBe(true);
                expect(response.mapVerification.isNamePresent).toBe(true);
                expect(response.mapVerification.isDescriptionPresent).toBe(true);
                expect(response.mapVerification.isMapHalfFloor).toBe(true);
                expect(response.mapVerification.isMapAccessible).toBe(true);
                expect(response.mapVerification.areStartingPointsValid).toBe(true);
                expect(response.mapVerification.areDoorsNextToWalls).toBe(true);
                expect(response.mapVerification.areDoorsNotNextToBorder).toBe(true);
                expect(response.mapVerification.isNameValid).toBe(true);
                expect(response.mapVerification.isDescriptionValid).toBe(true);
            });

            const req = httpMock.expectOne(`${apiUrl}/maps`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockMap);
            req.flush(validMapResponse);
        });

        it('should handle invalid map verification response', () => {
            const invalidMapResponse: MapResponse = {
                id: 1,
                mapVerification: invalidMapVerification,
            };

            service.saveMapToServer(mockMap).subscribe((response) => {
                expect(response).toEqual(invalidMapResponse);
                expect(response.mapVerification.isUniqueName).toBe(false);
                expect(response.mapVerification.isNamePresent).toBe(false);
                expect(response.mapVerification.isDescriptionPresent).toBe(false);
                expect(response.mapVerification.isMapHalfFloor).toBe(false);
                expect(response.mapVerification.isMapAccessible).toBe(false);
                expect(response.mapVerification.areStartingPointsValid).toBe(false);
                expect(response.mapVerification.areDoorsNextToWalls).toBe(false);
                expect(response.mapVerification.areDoorsNotNextToBorder).toBe(false);
                expect(response.mapVerification.isNameValid).toBe(false);
                expect(response.mapVerification.isDescriptionValid).toBe(false);
            });

            const req = httpMock.expectOne(`${apiUrl}/maps`);
            expect(req.request.method).toBe('POST');
            req.flush(invalidMapResponse);
        });

        it('should handle server error when saving map', () => {
            service.saveMapToServer(mockMap).subscribe({
                error: (error) => {
                    expect(error.status).toBe(500);
                },
            });

            const req = httpMock.expectOne(`${apiUrl}/maps`);
            req.flush('Error saving map', { status: 500, statusText: 'Internal Server Error' });
        });
    });

    describe('getAllMapsByVisibility', () => {
        it('should return visible maps', () => {
            const mockMaps: Map[] = [mockMap];

            service.getAllMapsByVisibility().subscribe((maps) => {
                expect(maps).toEqual(mockMaps);
            });

            const req = httpMock.expectOne(`${apiUrl}/maps/visibility/isVisible`);
            expect(req.request.method).toBe('GET');
            req.flush(mockMaps);
        });
    });

    describe('updateMapVisibility', () => {
        it('should update map visibility', () => {
            const mapId = 1;
            const isVisible = false;

            service.updateMapVisibility(mapId, isVisible).subscribe((map) => {
                expect(map).toEqual(mockMap);
            });

            const req = httpMock.expectOne(`${apiUrl}/maps/${mapId}/isVisible`);
            expect(req.request.method).toBe('PATCH');
            expect(req.request.body).toEqual({ isVisible });
            req.flush(mockMap);
        });
    });

    describe('saveMapImageOnServer', () => {
        it('should save map image', () => {
            const mapId = 1;
            const imagepng = 'base64-image-data';

            service.saveMapImageOnServer(mapId, imagepng).subscribe((map) => {
                expect(map).toEqual(mockMap);
            });

            const req = httpMock.expectOne(`${apiUrl}/maps/${mapId}/previewImage`);
            expect(req.request.method).toBe('PATCH');
            expect(req.request.body).toEqual({ previewImage: imagepng });
            req.flush(mockMap);
        });
    });

    describe('deleteMap', () => {
        it('should delete map', () => {
            const mapId = 1;

            service.deleteMap(mapId).subscribe((response) => {
                expect(response).toBeNull();
            });

            const req = httpMock.expectOne(`${apiUrl}/maps/${mapId}`);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);
        });

        it('should handle error when deleting non-existent map', () => {
            const mapId = 999;

            service.deleteMap(mapId).subscribe({
                error: (error) => {
                    expect(error.status).toBe(404);
                },
            });

            const req = httpMock.expectOne(`${apiUrl}/maps/${mapId}`);
            expect(req.request.method).toBe('DELETE');
            req.flush('Map not found', { status: 404, statusText: 'Not Found' });
        });
    });
});
