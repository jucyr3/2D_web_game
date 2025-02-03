// import { TestBed } from '@angular/core/testing';

import { MapVerificationService } from '@app/services/mapVerification/mapVerification.service';
import { ItemObject } from '@common/ItemObject';
import { Map } from '@common/map';
import { MapVerification } from '@common/mapVerification.interface';
import { TileTypes } from '@common/tileType.constants';
import { Test, TestingModule } from '@nestjs/testing';

const MAP_SIZE_SMALL = 10;
const MAP_SIZE_MEDIUM = 15;
const MAP_SIZE_LARGE = 20;

describe('MapVerificationService', () => {
    let service: MapVerificationService;
    let mockMap: Map;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MapVerificationService],
        }).compile();

        service = module.get<MapVerificationService>(MapVerificationService);
        mockMap = new Map('Untitled', MAP_SIZE_SMALL, true, '', 'Classic');
        mockMap.name = 'Untitled';
        mockMap.isVisible = true;
        mockMap.description = 'blblabla';
        mockMap.gameMode = 'Classic';
        for (let i = 0; i < MAP_SIZE_SMALL; i++) {
            for (let j = 0; j < MAP_SIZE_SMALL; j++) {
                mockMap.tileMatrix[i][j].type = TileTypes.GROUND_0;
                if (mockMap.tileMatrix[i][j].gameObject) {
                    mockMap.tileMatrix[i][j].gameObject = null;
                }
            }
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should check if name is unique', () => {
        service.setGameNames([{ name: 'test' }]);
        expect(service.isUniqueName('test')).toBeFalsy();
        expect(service.isUniqueName('test2')).toBeTruthy();
    });

    it('should check if map has description and name', () => {
        // set up valid map
        mockMap.tileMatrix[0][0].gameObject = new ItemObject('spawnpoint');
        mockMap.tileMatrix[0][1].gameObject = new ItemObject('spawnpoint');

        mockMap.name = '';
        expect(service.validateGame(mockMap).isNamePresent).toBeFalsy();
        mockMap.name = 'oiiei';

        mockMap.description = '';
        expect(service.validateGame(mockMap).isDescriptionPresent).toBeFalsy();
    });

    it('should check if map is half floor', () => {
        expect(service.isMapHalfFloor(mockMap)).toBeTruthy();
        for (let i = 0; i < MAP_SIZE_SMALL / 2; i++) {
            for (let j = 0; j < MAP_SIZE_SMALL; j++) {
                mockMap.tileMatrix[i][j].type = TileTypes.WALL;
            }
        }
        expect(service.isMapHalfFloor(mockMap)).toBeFalsy();
        mockMap.tileMatrix[0][0].type = TileTypes.GROUND_0;
        expect(service.isMapHalfFloor(mockMap)).toBeTruthy();
        mockMap.tileMatrix[0][0].type = TileTypes.WALL;
        expect(service.isMapHalfFloor(mockMap)).toBeFalsy();
        mockMap.tileMatrix[0][0].type = TileTypes.DOOR;
        expect(service.isMapHalfFloor(mockMap)).toBeFalsy();

        for (let i = MAP_SIZE_SMALL / 2; i < MAP_SIZE_SMALL; i++) {
            for (let j = 0; j < MAP_SIZE_SMALL; j++) {
                mockMap.tileMatrix[i][j].type = TileTypes.WALL;
            }
        }
        expect(service.isMapHalfFloor(mockMap)).toBeFalsy();
    });

    it('should check if map is accessible', () => {
        mockMap.tileMatrix[0][1].type = TileTypes.WALL;
        mockMap.tileMatrix[1][1].type = TileTypes.WALL;
        mockMap.tileMatrix[1][0].type = TileTypes.WALL;
        expect(service.isMapAccessible(mockMap)).toBeFalsy();
        mockMap.tileMatrix[1][1].type = TileTypes.GROUND_0;
        expect(service.isMapAccessible(mockMap)).toBeFalsy();
        mockMap.tileMatrix[0][0].type = TileTypes.WALL;
        expect(service.isMapAccessible(mockMap)).toBeTruthy();

        for (let i = 0; i < MAP_SIZE_SMALL; i++) {
            mockMap.tileMatrix[i][4].type = TileTypes.WALL;
        }
        expect(service.isMapAccessible(mockMap)).toBeFalsy();
    });

    it('should check if starting points are placed', () => {
        // for 10x10 map
        expect(service.areStartingPointsValid(mockMap)).toBeFalsy();
        mockMap.tileMatrix[0][0].gameObject = new ItemObject('spawnpoint');
        mockMap.tileMatrix[0][1].gameObject = new ItemObject('spawnpoint');
        expect(service.areStartingPointsValid(mockMap)).toBeTruthy();

        // 15x15 map
        const mockMap15 = new Map('Map by 15', MAP_SIZE_MEDIUM, true, '', 'Classic');
        expect(service.areStartingPointsValid(mockMap15)).toBeFalsy();
        mockMap15.tileMatrix[0][0].gameObject = new ItemObject('spawnpoint');
        mockMap15.tileMatrix[0][1].gameObject = new ItemObject('spawnpoint');
        expect(service.areStartingPointsValid(mockMap15)).toBeFalsy();
        mockMap15.tileMatrix[0][2].gameObject = new ItemObject('spawnpoint');
        mockMap15.tileMatrix[0][3].gameObject = new ItemObject('spawnpoint');
        expect(service.areStartingPointsValid(mockMap15)).toBeTruthy();

        // 20x20 map
        const mockMap20 = new Map('Map by 20', MAP_SIZE_LARGE, true, '', 'Classic');
        mockMap20.tileMatrix[0][0].gameObject = new ItemObject('spawnpoint');
        mockMap20.tileMatrix[0][1].gameObject = new ItemObject('spawnpoint');
        mockMap20.tileMatrix[0][2].gameObject = new ItemObject('spawnpoint');
        mockMap20.tileMatrix[0][3].gameObject = new ItemObject('spawnpoint');
        mockMap20.tileMatrix[0][4].gameObject = new ItemObject('spawnpoint');
        expect(service.areStartingPointsValid(mockMap20)).toBeFalsy();
        mockMap20.tileMatrix[0][5].gameObject = new ItemObject('spawnpoint');
        expect(service.areStartingPointsValid(mockMap20)).toBeTruthy();
    });

    it('should check if doors are between walls', () => {
        mockMap.tileMatrix[5][5].type = TileTypes.DOOR;
        expect(service.areDoorsNextToWalls(mockMap)).toBeFalsy();

        mockMap.tileMatrix[4][5].type = TileTypes.WALL;
        expect(service.areDoorsNextToWalls(mockMap)).toBeFalsy();

        mockMap.tileMatrix[6][5].type = TileTypes.WALL;
        expect(service.areDoorsNextToWalls(mockMap)).toBeTruthy();

        mockMap.tileMatrix[5][4].type = TileTypes.WALL;
        expect(service.areDoorsNextToWalls(mockMap)).toBeFalsy();
    });

    it('should check if walls are not next to the border', () => {
        mockMap.tileMatrix[0][0].type = TileTypes.DOOR;
        expect(service.areDoorsNotNextToBorder(mockMap)).toBeFalsy();

        mockMap.tileMatrix[0][0].type = TileTypes.GROUND_0;
        expect(service.areDoorsNotNextToBorder(mockMap)).toBeTruthy();

        mockMap.tileMatrix[0][1].type = TileTypes.DOOR;
        expect(service.areDoorsNotNextToBorder(mockMap)).toBeFalsy();

        mockMap.tileMatrix[0][1].type = TileTypes.WALL;
        mockMap.tileMatrix[5][MAP_SIZE_SMALL - 1].type = TileTypes.DOOR;
        expect(service.areDoorsNotNextToBorder(mockMap)).toBeFalsy();
    });

    it('should show the correct error message', () => {
        const listOfErrors = service.validateGame(mockMap);
        const comparison: MapVerification = {
            isUniqueName: true,
            isNamePresent: true,
            isDescriptionPresent: true,
            isMapHalfFloor: true,
            isMapAccessible: true,
            areStartingPointsValid: false,
            areDoorsNextToWalls: true,
            areDoorsNotNextToBorder: true,
        };
        expect(listOfErrors).toEqual(comparison);

        // triggers isUniqueName
        mockMap.name = 'test';

        // triggers isMapHalfFloor
        for (let i = 0; i < MAP_SIZE_SMALL / 2; i++) {
            for (let j = 0; j < MAP_SIZE_SMALL; j++) {
                mockMap.tileMatrix[i][j].type = TileTypes.WALL;
            }
        }

        // triggers isMapAccessible
        mockMap.tileMatrix[MAP_SIZE_SMALL - 1][1].type = TileTypes.WALL;
        mockMap.tileMatrix[MAP_SIZE_SMALL - 2][0].type = TileTypes.WALL;

        // triggers areDoorsNotNextToBorder
        mockMap.tileMatrix[MAP_SIZE_SMALL - 1][5].type = TileTypes.DOOR;
        // triggers areDoorsNextToWalls
        mockMap.tileMatrix[1][8].type = TileTypes.DOOR;

        // fixes the spawnpoints
        mockMap.tileMatrix[8][8].gameObject = new ItemObject('spawnpoint');
        mockMap.tileMatrix[8][9].gameObject = new ItemObject('spawnpoint');

        comparison.isUniqueName = false;
        comparison.isMapHalfFloor = false;
        comparison.isMapAccessible = false;
        comparison.areDoorsNextToWalls = false;
        comparison.areDoorsNotNextToBorder = false;
        comparison.areStartingPointsValid = true;

        const updatedList = service.validateGame(mockMap);
        expect(updatedList).toEqual(comparison);
    });
});
