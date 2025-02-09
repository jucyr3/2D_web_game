import { MapVerificationService } from '@app/services/mapVerification/mapVerification.service';
import { Map } from '@common/map';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import { MapService } from './map.service';

jest.mock('fs/promises');

describe('MapService', () => {
    const INVALID_MAP_ID = 999;
    let service: MapService;
    let mapVerificationService: jest.Mocked<MapVerificationService>;

    const mockTileMatrix: Tile[][] = [
        [
            { type: TileTypes.GROUND_0, isOccupied: false, isObstacle: false, itemObject: null },
            { type: TileTypes.WALL, isOccupied: false, isObstacle: true, itemObject: null },
            { type: TileTypes.DOOR, isOccupied: false, isObstacle: true, itemObject: null },
        ],
        [
            { type: TileTypes.GROUND_1, isOccupied: true, isObstacle: false, itemObject: { name: 'StartPoint' } },
            { type: TileTypes.GROUND_2, isOccupied: false, isObstacle: false, itemObject: null },
            { type: TileTypes.OPEN_DOOR, isOccupied: false, isObstacle: false, itemObject: null },
        ],
    ];

    const mockMap: Map = {
        id: 1,
        name: 'Test Map',
        size: 10,
        isVisible: true,
        description: 'Test Description',
        gameMode: 'CTF',
        tileMatrix: mockTileMatrix,
        lastModified: new Date(),
        previewImage: 'test.jpg',
    };

    const mockMapVerification = {
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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MapService,
                {
                    provide: MapVerificationService,
                    useValue: {
                        validateGame: jest.fn(),
                        setAllMapsNames: jest.fn(),
                        removeMapName: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<MapService>(MapService);
        mapVerificationService = module.get(MapVerificationService);

        // Silence logger in tests
        service['logger'].error = jest.fn();
        service['logger'].log = jest.fn();
        service['logger'].warn = jest.fn();
        service['logger'].debug = jest.fn();

        jest.clearAllMocks();
    });

    describe('getAllMaps', () => {
        it('should return cached maps if available', async () => {
            service['maps'] = [mockMap];
            const result = await service.getAllMaps();
            expect(result).toEqual([mockMap]);
            expect(fs.readFile).not.toHaveBeenCalled();
        });

        it('should load maps from file if not cached', async () => {
            service['maps'] = null;
            (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify({ maps: [mockMap] }));

            const result = await service.getAllMaps();

            expect(result).toHaveLength(1);
            expect(fs.readFile).toHaveBeenCalledWith('assets/maps.json', 'utf8');
            expect(mapVerificationService.setAllMapsNames).toHaveBeenCalled();
        });

        it('should handle file read errors', async () => {
            service['maps'] = null;
            (fs.readFile as jest.Mock).mockRejectedValue(new Error('File read error'));
            await expect(service.getAllMaps()).rejects.toThrow('Failed to retrieve maps');
        });
    });

    describe('saveMap', () => {
        beforeEach(() => {
            service['maps'] = [mockMap];
        });

        it('should update existing map when ID matches', async () => {
            const updatedMap = { ...mockMap, name: 'Updated Map' };
            mapVerificationService.validateGame.mockReturnValue(mockMapVerification);
            (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

            const result = await service.saveMap(updatedMap);

            expect(result.id).toBe(mockMap.id);
            expect(result.mapVerification).toEqual(mockMapVerification);
            expect(mapVerificationService.removeMapName).toHaveBeenCalledWith('Test Map');
            const updatedStoredMap = service['maps'].find((m) => m.id === mockMap.id);
            expect(updatedStoredMap.name).toBe('Updated Map');
        });

        it('should create new map when ID does not match', async () => {
            const newMap = { ...mockMap, id: 0 };
            mapVerificationService.validateGame.mockReturnValue(mockMapVerification);
            (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

            const result = await service.saveMap(newMap);

            expect(result.id).not.toBe(0);
            expect(result.mapVerification).toEqual(mockMapVerification);
            expect(service['maps'].length).toBe(2);
        });

        it('should handle validation failures for new maps', async () => {
            const invalidVerification = { ...mockMapVerification, isUniqueName: false };
            mapVerificationService.validateGame.mockReturnValue(invalidVerification);

            const result = await service.saveMap({ ...mockMap, id: 0 });

            expect(result.id).toBe(0);
            expect(result.mapVerification.isUniqueName).toBe(false);
            expect(fs.writeFile).not.toHaveBeenCalled();
        });
    });

    describe('updateMapVisibility', () => {
        beforeEach(() => {
            service['maps'] = [mockMap];
        });

        it('should update map visibility successfully', async () => {
            (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

            const result = await service.updateMapVisibility(mockMap.id, false);

            expect(result.isVisible).toBe(false);
            expect(fs.writeFile).toHaveBeenCalled();
        });

        it('should throw NotFoundException for non-existent map', async () => {
            await expect(service.updateMapVisibility(INVALID_MAP_ID, false)).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteMap', () => {
        beforeEach(() => {
            service['maps'] = [mockMap];
        });

        it('should delete map successfully', async () => {
            (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

            await service.deleteMap(mockMap.id);

            expect(service['maps']).toHaveLength(0);
            expect(fs.writeFile).toHaveBeenCalled();
        });

        it('should throw NotFoundException for non-existent map', async () => {
            await expect(service.deleteMap(INVALID_MAP_ID)).rejects.toThrow(NotFoundException);
        });
    });

    describe('loadMapFromJSON', () => {
        it('should correctly parse map data', () => {
            const result = service.loadMapFromJSON(mockMap);

            expect(result.id).toBe(mockMap.id);
            expect(result.name).toBe(mockMap.name);
            expect(result.tileMatrix).toHaveLength(mockMap.tileMatrix.length);
            expect(result.lastModified).toBeInstanceOf(Date);
        });

        it('should handle missing lastModified date', () => {
            const mapWithoutDate = { ...mockMap, lastModified: undefined };

            const result = service.loadMapFromJSON(mapWithoutDate);

            expect(result.lastModified).toBeInstanceOf(Date);
        });
    });
});
