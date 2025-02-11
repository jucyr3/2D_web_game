import { MapVerificationService } from '@app/services/mapVerification/mapVerification.service';
import { Map } from '@common/map';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs/promises';
import { MapService } from './map.service';

jest.mock('fs/promises');

describe('MapService', () => {
    let service: MapService;
    let mapVerificationService: jest.Mocked<MapVerificationService>;
    const mockDate = new Date('2025-02-10T00:00:00.000Z');

    const mockTile: Tile = {
        type: TileTypes.GROUND_0,
        isOccupied: false,
        isObstacle: false,
        itemObject: null,
    };

    const mockMap: Map = {
        mapId: 1,
        name: 'Test Map',
        size: 10,
        isVisible: true,
        description: 'Test Description',
        gameMode: 'Classic',
        tileMatrix: [[mockTile]],
        lastModified: mockDate,
        previewImage: 'test.jpg',
    };

    const mockVerification = {
        isUniqueName: true,
        isNamePresent: true,
        isDescriptionPresent: true,
        isMapHalfFloor: true,
        isMapAccessible: true,
        areStartingPointsValid: true,
        areItemsValid: true,
        areDoorsNextToWalls: true,
        areDoorsNotNextToBorder: true,
        isNameValid: true,
        isDescriptionValid: true,
        isFlagPresent: true,
    };

    beforeEach(async () => {
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const mockMapVerificationService = {
            setAllMapsNames: jest.fn(),
            removeMapName: jest.fn(),
            validateGame: jest.fn().mockReturnValue(mockVerification),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [MapService, { provide: MapVerificationService, useValue: mockMapVerificationService }],
        }).compile();

        service = module.get<MapService>(MapService);
        mapVerificationService = module.get(MapVerificationService);

        (fs.readFile as jest.Mock).mockReset();
        (fs.writeFile as jest.Mock).mockReset();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.resetAllMocks();
    });

    describe('getAllMaps', () => {
        it('should return cached maps', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = [mockMap];
            const result = await service.getAllMaps();
            expect(result).toEqual([mockMap]);
            expect(fs.readFile).not.toHaveBeenCalled();
        });

        it('should load maps from file', async () => {
            (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify({ maps: [mockMap] }));
            const result = await service.getAllMaps();

            expect(JSON.stringify(result[0])).toEqual(JSON.stringify(mockMap));
        });

        it('should handle file read errors', async () => {
            (fs.readFile as jest.Mock).mockRejectedValueOnce(new Error('File read error'));
            await expect(service.getAllMaps()).rejects.toThrow('Failed to retrieve maps');
        });
    });

    describe('getAllMapsByVisibility', () => {
        it('should return visible maps', async () => {
            const maps = [
                { ...mockMap, isVisible: true },
                { ...mockMap, id: 2, isVisible: false },
            ];
            (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify({ maps }));

            let result = await service.getAllMapsByVisibility();

            result = result.map((map) => ({
                ...map,
                lastModified: new Date(map.lastModified),
            }));

            const expectedMaps = maps.map((map) => ({
                ...map,
                lastModified: new Date(map.lastModified),
            }));

            expect(result).toEqual([expectedMaps[0]]);
        });

        it('should handle errors', async () => {
            (fs.readFile as jest.Mock).mockRejectedValueOnce(new Error('Error'));
            await expect(service.getAllMapsByVisibility()).rejects.toThrow('Failed to retrieve maps by visibility');
        });
    });

    describe('getMapById', () => {
        it('should return map by id', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = [mockMap];
            const result = await service.getMapById(1);
            expect(result).toEqual(mockMap);
        });

        it('should throw NotFoundException', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = [mockMap];
            const id = 999;
            await expect(service.getMapById(id)).rejects.toThrow(NotFoundException);
        });

        it('should handle other errors', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = null;
            await expect(service.getMapById(1)).rejects.toThrow('Failed to retrieve map');
        });
    });

    describe('saveMap', () => {
        beforeEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = [mockMap];
            (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
        });

        it('should update existing map', async () => {
            const updatedMap = { ...mockMap, description: 'Updated' };
            const result = await service.saveMap(updatedMap);
            expect(result).toEqual({
                id: mockMap.mapId,
                mapVerification: mockVerification,
            });
            expect(mapVerificationService.removeMapName).toHaveBeenCalledWith(mockMap.name);
        });

        it('should create new map', async () => {
            const timestamp = Date.now();
            const randomMax = 10000;
            const random = Math.floor(Math.random() * randomMax);
            const expectedId = parseInt(`${timestamp}${random}`, 10);
            jest.spyOn(global.Math, 'random').mockReturnValue(random / randomMax);
            jest.spyOn(Date, 'now').mockReturnValue(timestamp);

            const newMap = { ...mockMap, id: undefined };
            const result = await service.saveMap(newMap as Map);
            expect(result.id).toBe(expectedId);
            expect(result.mapVerification).toEqual(mockVerification);
        });

        it('should handle validation failure for new map', async () => {
            const failedVerification = { ...mockVerification, isUniqueName: false };
            mapVerificationService.validateGame.mockReturnValueOnce(failedVerification);
            const result = await service.saveMap({ ...mockMap, mapId: undefined } as Map);
            expect(result).toEqual({
                id: 0,
                mapVerification: failedVerification,
            });
        });

        it('should handle validation failure for existing map', async () => {
            const failedVerification = { ...mockVerification, isDescriptionValid: false };
            mapVerificationService.validateGame.mockReturnValueOnce(failedVerification);
            const result = await service.saveMap(mockMap);
            expect(result).toEqual({
                id: mockMap.mapId,
                mapVerification: failedVerification,
            });
        });

        it('should support CTF game mode', async () => {
            const ctfMap = { ...mockMap, gameMode: 'CTF' as const };
            const result = await service.saveMap(ctfMap);
            expect(result.mapVerification).toEqual(mockVerification);
        });

        it('should handle save errors', async () => {
            (fs.writeFile as jest.Mock).mockRejectedValueOnce(new Error('Save error'));
            await expect(service.saveMap(mockMap)).rejects.toThrow('Failed to create map');
        });

        it('should rethrow BadRequestException', async () => {
            mapVerificationService.validateGame.mockImplementationOnce(() => {
                throw new BadRequestException('Invalid map data');
            });

            await expect(service.saveMap(mockMap)).rejects.toThrow(BadRequestException);
        });
    });

    describe('updateMapVisibility', () => {
        it('should update visibility', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = [mockMap];
            const result = await service.updateMapVisibility(1, false);
            expect(result.isVisible).toBe(false);
            expect(fs.writeFile).toHaveBeenCalled();
        });

        it('should throw NotFoundException', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = [mockMap];
            const id = 999;
            await expect(service.updateMapVisibility(id, true)).rejects.toThrow(NotFoundException);
        });

        it('should handle update errors', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = [mockMap];
            (fs.writeFile as jest.Mock).mockRejectedValueOnce(new Error('Update error'));
            await expect(service.updateMapVisibility(1, false)).rejects.toThrow('Failed to update map visibility');
        });
    });

    describe('updateMapImage', () => {
        it('should update image', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = [mockMap];
            const result = await service.updateMapImage(1, 'new.jpg');
            expect(result.previewImage).toBe('new.jpg');
            expect(fs.writeFile).toHaveBeenCalled();
        });

        it('should throw NotFoundException', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = [mockMap];
            const id = 999;
            await expect(service.updateMapImage(id, 'new.jpg')).rejects.toThrow(NotFoundException);
        });

        it('should handle update errors', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = [mockMap];
            (fs.writeFile as jest.Mock).mockRejectedValueOnce(new Error('Update error'));
            await expect(service.updateMapImage(1, 'new.jpg')).rejects.toThrow('Failed to update map image');
        });
    });

    describe('deleteMap', () => {
        it('should delete map', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = [mockMap];
            await service.deleteMap(1);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((service as any).maps).toHaveLength(0);
            expect(fs.writeFile).toHaveBeenCalled();
        });

        it('should throw NotFoundException', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = [mockMap];
            const id = 999;
            await expect(service.deleteMap(id)).rejects.toThrow(NotFoundException);
        });

        it('should handle delete errors', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).maps = [mockMap];
            (fs.writeFile as jest.Mock).mockRejectedValueOnce(new Error('Delete error'));
            await expect(service.deleteMap(1)).rejects.toThrow('Failed to delete map');
        });
    });

    describe('parseTileMatrix', () => {
        it('should parse matrix correctly', () => {
            const result = service.parseTileMatrix(mockMap);
            expect(result).toEqual(mockMap.tileMatrix);
        });

        it('should handle tiles with items', () => {
            const tileWithItem: Tile = {
                type: TileTypes.GROUND_0,
                isOccupied: false,
                isObstacle: false,
                itemObject: { name: 'TestItem' },
            };

            const mapWithItem = {
                ...mockMap,
                tileMatrix: [[tileWithItem]],
            };

            const result = service.parseTileMatrix(mapWithItem);
            expect(result[0][0].itemObject).toEqual({ name: 'TestItem' });
        });

        it('should parse different tile types', () => {
            const mixedTiles: Tile[][] = [
                [
                    { type: TileTypes.GROUND_0, isOccupied: false, isObstacle: false, itemObject: null },
                    { type: TileTypes.WALL, isOccupied: false, isObstacle: true, itemObject: null },
                    { type: TileTypes.DOOR, isOccupied: false, isObstacle: false, itemObject: null },
                ],
            ];

            const mapWithMixedTiles = {
                ...mockMap,
                tileMatrix: mixedTiles,
            };

            const result = service.parseTileMatrix(mapWithMixedTiles);
            expect(result).toEqual(mixedTiles);
        });
    });

    describe('loadMapFromJSON', () => {
        it('should load map correctly', () => {
            const result = JSON.stringify(service.loadMapFromJSON(mockMap));
            const mock = JSON.stringify(mockMap);
            expect(result).toEqual(mock);
        });

        it('should set default lastModified', () => {
            const mapWithoutDate = { ...mockMap, lastModified: undefined };
            const result = service.loadMapFromJSON(mapWithoutDate);
            expect(result.lastModified).toBeInstanceOf(Date);
        });

        it('should handle complex tile matrix', () => {
            const complexMap = {
                ...mockMap,
                tileMatrix: [
                    [
                        { type: TileTypes.GROUND_0, isOccupied: true, isObstacle: false, itemObject: null },
                        { type: TileTypes.WALL, isOccupied: false, isObstacle: true, itemObject: { name: 'Item' } },
                    ],
                    [
                        { type: TileTypes.DOOR, isOccupied: false, isObstacle: false, itemObject: null },
                        { type: TileTypes.OPEN_DOOR, isOccupied: true, isObstacle: false, itemObject: null },
                    ],
                ],
            };
            const result = service.loadMapFromJSON(complexMap);
            expect(result.tileMatrix).toEqual(complexMap.tileMatrix);
        });
    });
});
