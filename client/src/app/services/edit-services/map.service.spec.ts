import { TestBed } from '@angular/core/testing';
import { ItemObject } from '@common/ItemObject';
import { Map } from '@common/map';
import { MapVerification } from '@common/mapVerification.interface';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';
import { MapService } from './map.service';
import { provideHttpClient } from '@angular/common/http';
import { MapFormData } from '@app/interfaces/mapFormData';
import { of } from 'rxjs';

describe('MapService', () => {
    let service: MapService;
    let mockMapElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient()],
        });
        service = TestBed.inject(MapService);

        // Setup mock DOM element for export tests
        mockMapElement = document.createElement('div');
        mockMapElement.className = 'map';
        document.body.appendChild(mockMapElement);

        // Mock html2canvas
        (window as any).html2canvas = jasmine.createSpy('html2canvas').and.callFake(() =>
            Promise.resolve({
                toDataURL: jasmine.createSpy('toDataURL').and.returnValue('data:image/jpeg;base64,abc123')
            })
        );

        // Mock fetch
        spyOn(window, 'fetch').and.returnValue(Promise.resolve({
            blob: () => Promise.resolve(new Blob())
        } as Response));
    });

    afterEach(() => {
        document.body.removeChild(mockMapElement);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set a default map', () => {
        service.setDefaultMap();
        expect(service.map).toBeTruthy();
        expect(service.map.size).toBe(15);
    });

    it('should save and load map from session storage', () => {
        service.setDefaultMap();
        service.saveMapToSessionStorage();
        const loaded = service.loadMapFromSessionStorage();
        expect(loaded).toBeTrue();
    });

    it('should return false when session storage is empty', () => {
        spyOn(sessionStorage, 'getItem').and.returnValue(null);
        expect(service.loadMapFromSessionStorage()).toBeFalse();
    });

    it('should return null if accessing item out of bounds', () => {
        service.setDefaultMap();
        expect(service.getItemObject(-1, -1)).toBeNull();
        expect(service.getItemObject(100, 100)).toBeNull();
    });

    it('should change tile type', () => {
        service.setDefaultMap();
        service.changeTileType(0, 0, TileTypes.GROUND_2);
        expect(service.getTileType(0, 0)).toBe(TileTypes.GROUND_2);
    });

    it('should place and remove a game object', () => {
        service.setDefaultMap();
        const item: ItemObject = { name: 'Sword' };
        service.placeGameObject(2, 3, item);
        expect(service.getItemObject(2, 3)).toEqual(item);
        service.removeGameObject(2, 3);
        expect(service.getItemObject(2, 3)).toBeNull();
    });

    it('should move a game object', () => {
        service.setDefaultMap();
        const item: ItemObject = { name: 'Shield' };
        service.placeGameObject(1, 1, item);
        service.moveGameObject(1, 1, 2, 2);
        expect(service.getItemObject(2, 2)).toEqual(item);
        expect(service.getItemObject(1, 1)).toBeNull();
    });

    it('should reset item to start position', () => {
        service.setDefaultMap();
        const item: ItemObject = { name: 'Bow' };
        service.resetItemToStartPosition(3, 3, item);
        expect(service.getItemObject(3, 3)).toEqual(item);
    });

    it('should create an empty map with specified data', () => {
        const mapData: MapFormData = { size: 20, gameMode: 'Classic' };
        service.createEmptyMap(mapData);
        expect(service.map.size).toBe(20);
        expect(service.map.gameMode).toBe('Classic');
        expect(service.map.tileMatrix.length).toBe(20);
        expect(service.itemManager).toBeTruthy();
    });

    it('should flatten tile matrix correctly', () => {
        service.setDefaultMap();
        const flattenedTiles = service.flattenedTileMatrix();
        expect(flattenedTiles.length).toBe(service.map.size * service.map.size);
        expect(Array.isArray(flattenedTiles)).toBeTrue();
    });

    it('should load map from server successfully', async () => {
        const mockMap: Map = {
            id: 1,
            name: 'Test',
            size: 15,
            isVisible: true,
            description: 'Test',
            gameMode: 'Classic',
            tileMatrix: [],
            lastModified: new Date(),
        };

        spyOn(service['clientHttpRequest'], 'loadMapById').and.returnValue(of(mockMap));
        spyOn(service, 'saveMapToSessionStorage');

        const result = await service.loadMapFromServer(1);

        expect(result).toBeTrue();
        expect(service.map).toBeTruthy();
        expect(service.errorList).toEqual([]);
        expect(service.saveMapToSessionStorage).toHaveBeenCalled();
    });

    it('should correctly parse tile matrix and handle gameObjects', () => {
        const mockItemManager = jasmine.createSpyObj('ItemManager', ['decreaseItemAmount']);
        service.itemManager = mockItemManager;

        const json = {
            name: 'Test Map',
            id: 1,
            size: 10,
            isVisible: true,
            description: 'Test Description',
            gameMode: 'Classic',
            tileMatrix: [
                [
                    { type: TileTypes.GROUND_1, isOccupied: false, isObstacle: false } as Tile,
                    { type: TileTypes.GROUND_1, isOccupied: false, isObstacle: false, itemObject: { name: 'Sword' } } as Tile,
                ],
                [
                    { type: TileTypes.GROUND_1, isOccupied: false, isObstacle: false } as Tile,
                    { type: TileTypes.GROUND_1, isOccupied: false, isObstacle: false } as Tile,
                ],
            ],
            lastModified: new Date('2025-02-01'),
        } as Map;

        const tileMatrix = service.parseTileMatrix(json);

        expect(tileMatrix.length).toBe(2);
        expect(tileMatrix[0][1].itemObject?.name).toBe('Sword');
        expect(mockItemManager.decreaseItemAmount).toHaveBeenCalledWith('Sword');
    });

    it('should save map to server successfully', async () => {
        const mockResponse = {
            id: 1,
            mapVerification: {
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
            },
        };

        spyOn(service['clientHttpRequest'], 'saveMapToServer').and.returnValue(of(mockResponse));
        service.map = { id: 0 } as Map;

        const result = await service.saveMapToServer();

        expect(result).toEqual(mockResponse.mapVerification);
        expect(service.map.id).toBe(mockResponse.id);
    });

    it('should initialize with default map when session storage is empty', () => {
        const mockClientHttpRequest = jasmine.createSpyObj('ClientHttpRequestsService', ['someMethod']);
        const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        spyOn(MapService.prototype, 'loadMapFromSessionStorage').and.returnValue(false);
        spyOn(MapService.prototype, 'setDefaultMap').and.callThrough();
        spyOn(MapService.prototype, 'saveMapToSessionStorage').and.callThrough();

        service = new MapService(mockClientHttpRequest, mockRouter);

        expect(service.setDefaultMap).toHaveBeenCalled();
        expect(service.saveMapToSessionStorage).toHaveBeenCalled();
        expect(service.itemManager).toBeTruthy();
    });

    it('should save map and handle successful verification', async () => {
        const mockVerification: MapVerification = {
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

        spyOn(service, 'saveMapToServer').and.returnValue(Promise.resolve(mockVerification));
        spyOn(service, 'exportMapAsImage').and.returnValue(Promise.resolve(new Blob()));
        spyOn(service['router'], 'navigate');

        await service.saveMap();
        expect(service.errorList.length).toBe(0);
        expect(service['router'].navigate).toHaveBeenCalledWith(['/admin']);
    });

    it('should create a map from JSON', () => {
        const json = {
            name: 'Test Map',
            id: 1,
            size: 10,
            isVisible: true,
            description: 'Test Description',
            gameMode: 'Classic',
            tileMatrix: Array(10)
                .fill([])
                .map(() => Array(10).fill({ type: 'GROUND_1', isOccupied: false, isObstacle: false })),
            lastModified: new Date('2025-02-01'),
        } as Map;
        const newMap = service.createMapFromJSON(json);
        expect(newMap.name).toBe('Test Map');
        expect(newMap.size).toBe(10);
    });

    it('should return the correct tile texture path', () => {
        service.setDefaultMap();
        service.changeTileType(1, 1, TileTypes.GROUND_1);
        expect(service.getTileTexture(1, 1)).toBe('url(assets/tiles/groundTile1.png)');
    });

    it('should call saveMapToSessionStorage and saveMapToServer when saving map', () => {
        spyOn(service, 'saveMapToSessionStorage');
        spyOn(service, 'saveMapToServer');
        service.saveMap();
        expect(service.saveMapToSessionStorage).toHaveBeenCalled();
        expect(service.saveMapToServer).toHaveBeenCalled();
    });

    it('should set default tile type', () => {
        service.setDefaultMap();
        service.changeTileType(0, 0, TileTypes.GROUND_2);
        service.setDefaultTileType(0, 0);
        expect(service.getTileType(0, 0)).toBe(TileTypes.GROUND_1);
    });

    it('should call loadMapFromSessionStorage when calling resetMap', () => {
        spyOn(service, 'loadMapFromSessionStorage');
        service.resetMap();
        expect(service.loadMapFromSessionStorage).toHaveBeenCalled();
    });

    it('should handle mapVerificationErrors', () => {
        const mapVerification: MapVerification = {
            isUniqueName: false,
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
        service.handleMapVerificationError(mapVerification);
        expect(service.errorList.length).toBe(1);
    });

    describe('exportMapAsImage()', () => {
        it('should generate image blob when element exists', async () => {
            const mockCanvas = {
                toDataURL: jasmine.createSpy('toDataURL').and.returnValue('data:image/jpeg;base64,abc123')
            };
            (window as any).html2canvas = jasmine.createSpy('html2canvas').and.returnValue(Promise.resolve(mockCanvas));

            const blob = await service.exportMapAsImage();

            expect((window as any).html2canvas).toHaveBeenCalledWith(mockMapElement, jasmine.objectContaining({
                scale: 1,
                useCORS: true,
                backgroundColor: 'transparent'
            }));
            expect(service['clientHttpRequest'].saveMapImageOnServer).toHaveBeenCalledWith(service.map.id, 'abc123');
            expect(blob).toBeInstanceOf(Blob);
        });

        it('should use correct compression settings', async () => {
            const mockCanvas = {
                toDataURL: jasmine.createSpy('toDataURL').and.returnValue('data:image/jpeg;base64,abc123')
            };
            (window as any).html2canvas = jasmine.createSpy('html2canvas').and.returnValue(Promise.resolve(mockCanvas));

            await service.exportMapAsImage();

            expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.3);
        });

        it('should handle html2canvas errors', async () => {
            (window as any).html2canvas = jasmine.createSpy('html2canvas').and.returnValue(Promise.reject(new Error('Rendering failed')));

            await expectAsync(service.exportMapAsImage()).toBeRejectedWithError('Error exporting map as image: Rendering failed');
        });

        it('should throw error when map element not found during export', async () => {
            document.body.removeChild(mockMapElement);
            await expectAsync(service.exportMapAsImage()).toBeRejectedWithError('Map element not found');
        });
    });
});