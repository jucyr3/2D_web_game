import { TestBed } from '@angular/core/testing';
import { SaveService } from '@app/services/save.service';

import { Map } from '@common/map';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';

const MAP_SIZE_SMALL = 10;
const MAP_SIZE_MEDIUM = 15;
const MAP_SIZE_LARGE = 20;

describe('SaveService', () => {
    let service: SaveService;
    const mockMap = new Map('Untitled', MAP_SIZE_SMALL, true, '', 'Classic');

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.inject(SaveService);
        mockMap.name = 'Untitled';
        mockMap.isVisible = true;
        mockMap.description = '';
        mockMap.gameMode = 'Classic';
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should check if name is unique', () => {
        service.setGameNames([{ name: 'test' }]);
        expect(service.isUniqueName('test')).toBeTrue();
        expect(service.isUniqueName('test2')).toBeFalse();
    });

    it('should check if map is half floor', () => {
        expect(service.isMapHalfFloor(mockMap)).toBeTrue();
        for (let i = 0; i < MAP_SIZE_SMALL / 2; i++) {
            for (let j = 0; j < MAP_SIZE_SMALL; j++) {
                mockMap.tileMatrix[i][j] = new Tile(TileTypes.WALL, false, false);
            }
        }
        expect(service.isMapHalfFloor(mockMap)).toBeFalse();
        mockMap.tileMatrix[0][0] = new Tile(TileTypes.GROUND_0, false, false);
        expect(service.isMapHalfFloor(mockMap)).toBeTrue();
        mockMap.tileMatrix[0][0] = new Tile(TileTypes.DOOR, false, false);
        expect(service.isMapHalfFloor(mockMap)).toBeTrue();
        mockMap.tileMatrix[0][0] = new Tile(TileTypes.WALL, false, false);

        for (let i = MAP_SIZE_SMALL / 2; i < MAP_SIZE_SMALL; i++) {
            for (let j = 0; j < MAP_SIZE_SMALL; j++) {
                mockMap.tileMatrix[i][j] = new Tile(TileTypes.WALL, false, false);
            }
        }
        expect(service.isMapHalfFloor(mockMap)).toBeFalse();
    });

    it('shoul check if map is accessible', () => {
        mockMap.tileMatrix[0][1] = new Tile(TileTypes.WALL, false, false);
        mockMap.tileMatrix[1][1] = new Tile(TileTypes.WALL, false, false);
        mockMap.tileMatrix[1][0] = new Tile(TileTypes.WALL, false, false);
        expect(service.isMapAccessible(mockMap)).toBeFalse();
        mockMap.tileMatrix[1][1] = new Tile(TileTypes.GROUND_0, false, false);
        expect(service.isMapAccessible(mockMap)).toBeTrue();

        for (let i = 0; i < MAP_SIZE_SMALL; i++) {
            mockMap.tileMatrix[i][4] = new Tile(TileTypes.WALL, false, false);
        }
        expect(service.isMapAccessible(mockMap)).toBeFalse();
    });

    it('should check if starting points are placed', () => {
        // for 10x10 map
        expect(service.areStartingPointsValid(mockMap)).toBeFalse();
        mockMap.tileMatrix[0][0].isOccupied = true;
        mockMap.tileMatrix[0][1].isOccupied = true;
        expect(service.areStartingPointsValid(mockMap)).toBeTrue();

        // 15x15 map
        const mockMap15 = new Map('Map by 15', MAP_SIZE_MEDIUM, true, '', 'Classic');
        expect(service.areStartingPointsValid(mockMap15)).toBeFalse();
        mockMap15.tileMatrix[0][0].isOccupied = true;
        mockMap15.tileMatrix[0][1].isOccupied = true;
        expect(service.areStartingPointsValid(mockMap15)).toBeFalse();
        mockMap15.tileMatrix[0][2].isOccupied = true;
        mockMap15.tileMatrix[0][3].isOccupied = true;
        expect(service.areStartingPointsValid(mockMap15)).toBeFalse();

        // 20x20 map
        const mockMap20 = new Map('Map by 20', MAP_SIZE_LARGE, true, '', 'Classic');
        mockMap20.tileMatrix[0][0].isOccupied = true;
        mockMap20.tileMatrix[0][1].isOccupied = true;
        mockMap20.tileMatrix[0][2].isOccupied = true;
        mockMap20.tileMatrix[0][3].isOccupied = true;
        mockMap20.tileMatrix[0][4].isOccupied = true;
        expect(service.areStartingPointsValid(mockMap20)).toBeFalse();
        mockMap20.tileMatrix[0][5].isOccupied = true;
        expect(service.areStartingPointsValid(mockMap20)).toBeTrue();
    });

    it('should check if walls are valid', () => {
        mockMap.tileMatrix[5][5].type = TileTypes.DOOR;
        expect(service.areDoorsValid(mockMap)).toBeFalse();

        mockMap.tileMatrix[4][5].type = TileTypes.WALL;
        mockMap.tileMatrix[5][4].type = TileTypes.WALL;
        expect(service.areDoorsValid(mockMap)).toBeFalse();

        mockMap.tileMatrix[6][5].type = TileTypes.WALL;
        expect(service.areDoorsValid(mockMap)).toBeTrue();
    });
});
