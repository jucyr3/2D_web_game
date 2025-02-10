import { MapVerificationService } from '@app/services/mapVerification/mapVerification.service';
import { ItemObject } from '@common/ItemObject';
import { Map } from '@common/map';
import { MapProperties } from '@common/map.constants';
import { MapVerification } from '@common/mapVerification.interface';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';
import { Test, TestingModule } from '@nestjs/testing';

describe('MapVerificationService', () => {
    let service: MapVerificationService;

    function createMockMap(id: number, size: number): Map {
        return {
            mapId: id,
            name: `Untitled${id}`,
            size,
            isVisible: true,
            description: 'No description',
            gameMode: 'Classic',
            tileMatrix: Array.from({ length: size }, () => Array.from({ length: size }, () => ({ ...defaultTile }))),
            lastModified: new Date(),
        };
    }

    const defaultTile: Tile = {
        type: TileTypes.GROUND_0,
        isOccupied: false,
        isObstacle: false,
        itemObject: null,
    };

    const mockMap: Map = createMockMap(1, MapProperties.MAP_SIZE_SMALL);

    const spawnpoint: ItemObject = {
        name: 'spawnpoint',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MapVerificationService],
        }).compile();

        service = module.get<MapVerificationService>(MapVerificationService);

        mockMap.name = 'Untitled';
        mockMap.isVisible = true;
        mockMap.description = 'No description';
        mockMap.gameMode = 'Classic';
        mockMap.tileMatrix = Array.from({ length: MapProperties.MAP_SIZE_SMALL }, () =>
            Array.from({ length: MapProperties.MAP_SIZE_SMALL }, () => ({ ...defaultTile })),
        );
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
        mockMap.tileMatrix[0][0].itemObject = { ...spawnpoint };
        mockMap.tileMatrix[0][1].itemObject = { ...spawnpoint };

        mockMap.name = '';
        expect(service.validateGame(mockMap).isNamePresent).toBeFalsy();
        mockMap.name = 'oiiei';

        mockMap.description = '';
        expect(service.validateGame(mockMap).isDescriptionPresent).toBeFalsy();
    });

    it('it should check if name and description are within max range', () => {
        mockMap.name = 'hi this is a really long name to fill up enough space';
        expect(service.isNameValid(mockMap)).toBeFalsy();

        mockMap.description =
            "It says I need to type at least ten characters, so here's this. " +
            "Y'know what? I'm gonna type one hundred characters instead. " +
            "Actually, I'm going to type five hundred characters. " +
            "I'm definitely not going to type anywhere near one thousand characters, " +
            "because that'd be ridiculous. Even if I wanted to type one thousand characters, " +
            "I have to go to bed now anyway, so I simply don't have the time. " +
            'I mean, I could just type a bunch of random letters or hold down one key, ' +
            'but that would be no fun at all. ';
        expect(service.isDescriptionValid(mockMap)).toBeFalsy();
    });

    it('should check if map is half floor', () => {
        expect(service.isMapHalfFloor(mockMap)).toBeTruthy();
        for (let i = 0; i < MapProperties.MAP_SIZE_SMALL / 2; i++) {
            for (let j = 0; j < MapProperties.MAP_SIZE_SMALL; j++) {
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

        for (let i = MapProperties.MAP_SIZE_SMALL / 2; i < MapProperties.MAP_SIZE_SMALL; i++) {
            for (let j = 0; j < MapProperties.MAP_SIZE_SMALL; j++) {
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

        for (let i = 0; i < MapProperties.MAP_SIZE_SMALL; i++) {
            mockMap.tileMatrix[i][4].type = TileTypes.WALL;
        }
        expect(service.isMapAccessible(mockMap)).toBeFalsy();
    });

    it('should validate starting points placement correctly', () => {
        // for MAP_SIZE_SMALL map
        expect(service.areStartingPointsValid(mockMap)).toBeFalsy();
        mockMap.tileMatrix[0][0].itemObject = { ...spawnpoint };
        mockMap.tileMatrix[0][1].itemObject = { ...spawnpoint };
        expect(service.areStartingPointsValid(mockMap)).toBeTruthy();

        // MAP_SIZE_MEDIUM map
        const mockMap15: Map = createMockMap(2, MapProperties.MAP_SIZE_MEDIUM);

        expect(service.areStartingPointsValid(mockMap15)).toBeFalsy();
        mockMap15.tileMatrix[0][0].itemObject = { ...spawnpoint };
        mockMap15.tileMatrix[0][1].itemObject = { ...spawnpoint };
        expect(service.areStartingPointsValid(mockMap15)).toBeFalsy();
        mockMap15.tileMatrix[0][2].itemObject = { ...spawnpoint };
        mockMap15.tileMatrix[0][3].itemObject = { ...spawnpoint };
        expect(service.areStartingPointsValid(mockMap15)).toBeTruthy();

        // MAP_SIZE_LARGE map
        const mockMap20: Map = createMockMap(2, MapProperties.MAP_SIZE_LARGE);

        mockMap20.tileMatrix[0][0].itemObject = { ...spawnpoint };
        mockMap20.tileMatrix[0][1].itemObject = { ...spawnpoint };
        mockMap20.tileMatrix[0][2].itemObject = { ...spawnpoint };
        mockMap20.tileMatrix[0][3].itemObject = { ...spawnpoint };
        mockMap20.tileMatrix[0][4].itemObject = { ...spawnpoint };
        expect(service.areStartingPointsValid(mockMap20)).toBeFalsy();
        mockMap20.tileMatrix[0][5].itemObject = { ...spawnpoint };
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
        mockMap.tileMatrix[5][MapProperties.MAP_SIZE_SMALL - 1].type = TileTypes.DOOR;
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
            isNameValid: true,
            isDescriptionValid: true,
        };
        expect(listOfErrors).toEqual(comparison);

        // triggers isUniqueName
        mockMap.name = 'test';

        // triggers isMapHalfFloor
        for (let i = 0; i < MapProperties.MAP_SIZE_SMALL / 2; i++) {
            for (let j = 0; j < MapProperties.MAP_SIZE_SMALL; j++) {
                mockMap.tileMatrix[i][j].type = TileTypes.WALL;
            }
        }

        // triggers isMapAccessible
        mockMap.tileMatrix[MapProperties.MAP_SIZE_SMALL - 1][1].type = TileTypes.WALL;
        mockMap.tileMatrix[MapProperties.MAP_SIZE_SMALL - 2][0].type = TileTypes.WALL;

        // triggers areDoorsNotNextToBorder
        mockMap.tileMatrix[MapProperties.MAP_SIZE_SMALL - 1][5].type = TileTypes.DOOR;
        // triggers areDoorsNextToWalls
        mockMap.tileMatrix[1][8].type = TileTypes.DOOR;

        // fixes the spawnpoints
        mockMap.tileMatrix[8][8].itemObject = { ...spawnpoint };
        mockMap.tileMatrix[8][9].itemObject = { ...spawnpoint };

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
