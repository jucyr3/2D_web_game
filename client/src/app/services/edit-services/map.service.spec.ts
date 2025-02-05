import { TestBed } from '@angular/core/testing';
import { ItemManager } from '@app/classes/item-manager';
import { ItemObject } from '@common/ItemObject';
import { TileTypes } from '@common/tileType.constants';
import { MapService } from './map.service';
import { MapVerification } from '@common/mapVerification.interface';
import { Tile } from '@common/tile';
import { Map } from '@common/map';

/* eslint-disable @typescript-eslint/no-magic-numbers */

describe('MapService', () => {
    let service: MapService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MapService);
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

    it('should return false when loading map from server', () => {
        expect(service.loadMapFromServer()).toBeFalse();
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

    it('should set default map and initialize itemManager if both loadMapFromSessionStorage and loadMapFromServer fail', () => {
        spyOn(MapService.prototype, 'loadMapFromSessionStorage').and.returnValue(false);
        spyOn(MapService.prototype, 'loadMapFromServer').and.returnValue(false);
        spyOn(MapService.prototype, 'setDefaultMap').and.callThrough();
        spyOn(MapService.prototype, 'saveMapToSessionStorage').and.callThrough();

        service = new MapService();

        expect(service.loadMapFromSessionStorage).toHaveBeenCalled();
        expect(service.loadMapFromServer).toHaveBeenCalled();
        expect(service.setDefaultMap).toHaveBeenCalled();
        expect(service.saveMapToSessionStorage).toHaveBeenCalled();
        expect(service.itemManager).toBeDefined();
        expect(service.itemManager).toBeInstanceOf(ItemManager);
        expect(service.map).toBeDefined();
        expect(service.map.size).toBe(15);
    });

    it('should call handleMapVerificationError when calling saveMapToServer', () => {
        spyOn(service, 'handleMapVerificationError');
        service.saveMap();
        expect(service.handleMapVerificationError).toHaveBeenCalled();
    });

    it('should return error list with mapVerificationErrors', () => {
        const mapVerification: MapVerification = {
            isUniqueName: false,
            isNamePresent: true,
            isDescriptionPresent: true,
            isMapHalfFloor: true,
            isMapAccessible: true,
            areStartingPointsValid: true,
            areDoorsNextToWalls: true,
            areDoorsNotNextToBorder: true,
        };
        service.handleMapVerificationError(mapVerification);
        expect(service.errorList.length).toBe(1);
    });
});
