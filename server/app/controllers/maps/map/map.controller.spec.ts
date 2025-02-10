import { MapService } from '@app/services/maps/map/map.service';
import { Map } from '@common/map';
import { MapResponse } from '@common/mapResponse';
import { TileTypes } from '@common/tileType.constants';
import { HttpException, Logger, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MapController } from './map.controller';

describe('MapController', () => {
    const INVALID_MAP_ID = 999;
    let controller: MapController;
    let mapService: jest.Mocked<MapService>;
    let loggerSpy: jest.SpyInstance;

    const mockTileMatrix = [
        [
            { type: TileTypes.GROUND_0, isOccupied: false, isObstacle: false, itemObject: null },
            { type: TileTypes.WALL, isOccupied: false, isObstacle: true, itemObject: null },
        ],
        [
            { type: TileTypes.GROUND_1, isOccupied: true, isObstacle: false, itemObject: { name: 'StartPoint' } },
            { type: TileTypes.DOOR, isOccupied: false, isObstacle: true, itemObject: null },
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
        areItemsValid: true,
        areDoorsNextToWalls: true,
        areDoorsNotNextToBorder: true,
        isNameValid: true,
        isDescriptionValid: true,
        isFlagPresent: true,
    };

    const mockMapResponse: MapResponse = {
        id: 1,
        mapVerification: mockMapVerification,
    };

    beforeAll(() => {
        loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn());
    });

    afterAll(() => {
        loggerSpy.mockRestore();
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MapController],
            providers: [
                {
                    provide: MapService,
                    useValue: {
                        getAllMaps: jest.fn(),
                        getAllMapsByVisibility: jest.fn(),
                        getMapById: jest.fn(),
                        saveMap: jest.fn(),
                        updateMapVisibility: jest.fn(),
                        updateMapImage: jest.fn(),
                        deleteMap: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<MapController>(MapController);
        mapService = module.get(MapService);

        jest.clearAllMocks();
    });

    describe('getAllMaps', () => {
        it('should return an array of maps', async () => {
            const maps = [mockMap];
            mapService.getAllMaps.mockResolvedValue(maps);

            const result = await controller.getAllMaps();

            expect(result).toEqual(maps);
            expect(mapService.getAllMaps).toHaveBeenCalled();
        });

        it('should handle database errors appropriately', async () => {
            const error = new Error('Database error');
            mapService.getAllMaps.mockRejectedValue(error);

            await expect(controller.getAllMaps()).rejects.toThrow(error);
            expect(loggerSpy).toHaveBeenCalled();
            expect(loggerSpy.mock.calls[0][0]).toMatch(/Failed to get all maps/);
        });
    });

    describe('getMapById', () => {
        it('should return a single map', async () => {
            mapService.getMapById.mockResolvedValue(mockMap);

            const result = await controller.getMapById(1);

            expect(result).toEqual(mockMap);
            expect(mapService.getMapById).toHaveBeenCalledWith(1);
        });

        it('should handle not found errors properly', async () => {
            const notFoundError = new NotFoundException('Map not found');
            mapService.getMapById.mockRejectedValue(notFoundError);

            await expect(controller.getMapById(INVALID_MAP_ID)).rejects.toThrow(NotFoundException);
            expect(loggerSpy).toHaveBeenCalled();
            expect(loggerSpy.mock.calls[0][0]).toMatch(/Failed to get map/);
        });
    });

    describe('getMapsByVisibility', () => {
        it('should return visible maps', async () => {
            const visibleMaps = [mockMap];
            mapService.getAllMapsByVisibility.mockResolvedValue(visibleMaps);

            const result = await controller.getMapsByVisibility();

            expect(result).toEqual(visibleMaps);
            expect(mapService.getAllMapsByVisibility).toHaveBeenCalled();
        });

        it('should handle service errors appropriately', async () => {
            const error = new Error('Service error');
            mapService.getAllMapsByVisibility.mockRejectedValue(error);

            await expect(controller.getMapsByVisibility()).rejects.toThrow(error);
            expect(loggerSpy).toHaveBeenCalled();
            expect(loggerSpy.mock.calls[0][0]).toMatch(/Failed to get maps by visibility/);
        });
    });

    describe('saveMap', () => {
        it('should create a new map successfully', async () => {
            mapService.saveMap.mockResolvedValue(mockMapResponse);

            const result = await controller.saveMap(mockMap);

            expect(result).toEqual(mockMapResponse);
            expect(mapService.saveMap).toHaveBeenCalledWith(mockMap);
        });

        it('should handle validation failures appropriately', async () => {
            const invalidResponse = {
                id: 0,
                mapVerification: { ...mockMapVerification, isUniqueName: false },
            };
            mapService.saveMap.mockResolvedValue(invalidResponse);

            const result = await controller.saveMap(mockMap);

            expect(result.id).toBe(0);
            expect(result.mapVerification.isUniqueName).toBe(false);
        });

        it('should handle service errors with proper status code', async () => {
            const serviceError = new Error('Service error');
            mapService.saveMap.mockRejectedValue(serviceError);

            await expect(controller.saveMap(mockMap)).rejects.toThrow(HttpException);
            expect(loggerSpy).toHaveBeenCalled();
            expect(loggerSpy.mock.calls[0][0]).toMatch(/Failed to create map/);
            expect(loggerSpy.mock.calls[0][0]).toContain(serviceError.message);
        });
    });

    describe('updateMapVisibility', () => {
        it('should update map visibility successfully', async () => {
            const updatedMap = { ...mockMap, isVisible: false };
            mapService.updateMapVisibility.mockResolvedValue(updatedMap);

            const result = await controller.updateMapVisibility(1, false);

            expect(result.isVisible).toBe(false);
            expect(mapService.updateMapVisibility).toHaveBeenCalledWith(1, false);
        });

        it('should handle not found errors properly', async () => {
            mapService.updateMapVisibility.mockRejectedValue(new NotFoundException());

            await expect(controller.updateMapVisibility(INVALID_MAP_ID, false)).rejects.toThrow(NotFoundException);
            expect(loggerSpy).toHaveBeenCalled();
            expect(loggerSpy.mock.calls[0][0]).toMatch(/Failed to update map.*visibility/);
        });
    });

    describe('updatePreviewImage', () => {
        it('should update preview image successfully', async () => {
            const updatedMap = { ...mockMap, previewImage: 'new-image.jpg' };
            mapService.updateMapImage.mockResolvedValue(updatedMap);

            const result = await controller.updatePreviewImage(1, 'new-image.jpg');

            expect(result.previewImage).toBe('new-image.jpg');
            expect(mapService.updateMapImage).toHaveBeenCalledWith(1, 'new-image.jpg');
        });

        it('should handle update errors properly', async () => {
            mapService.updateMapImage.mockRejectedValue(new NotFoundException());

            await expect(controller.updatePreviewImage(INVALID_MAP_ID, 'new-image.jpg')).rejects.toThrow(NotFoundException);
            expect(loggerSpy).toHaveBeenCalled();
            expect(loggerSpy.mock.calls[0][0]).toMatch(/Failed to update map.*image/);
        });
    });

    describe('deleteMap', () => {
        it('should delete map successfully', async () => {
            mapService.deleteMap.mockResolvedValue(undefined);

            await controller.deleteMap(1);

            expect(mapService.deleteMap).toHaveBeenCalledWith(1);
        });

        it('should handle delete errors properly', async () => {
            const error = new Error('Delete failed');
            mapService.deleteMap.mockRejectedValue(error);

            await expect(controller.deleteMap(1)).rejects.toThrow('Delete failed');
            expect(loggerSpy).toHaveBeenCalled();
            expect(loggerSpy.mock.calls[0][0]).toMatch(/Failed to delete map/);
        });

        it('should handle not found errors during deletion', async () => {
            mapService.deleteMap.mockRejectedValue(new NotFoundException());

            await expect(controller.deleteMap(INVALID_MAP_ID)).rejects.toThrow(NotFoundException);
            expect(loggerSpy).toHaveBeenCalled();
            expect(loggerSpy.mock.calls[0][0]).toMatch(/Failed to delete map/);
        });
    });
});
