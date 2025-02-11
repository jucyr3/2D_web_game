import { Test, TestingModule } from '@nestjs/testing';
import { MapController } from './map.controller';
import { MapService } from '@app/services/maps/map/map.service';
import { Map } from '@common/map';
import { MapResponse } from '@common/mapResponse';
import { HttpException, NotFoundException, Logger } from '@nestjs/common';
import { TileTypes } from '@common/tileType.constants';

describe('MapController', () => {
    let controller: MapController;
    let service: MapService;
    let mockLogger: { error: jest.Mock };

    beforeAll(() => {
        mockLogger = { error: jest.fn() };
        jest.spyOn(Logger.prototype, 'error').mockImplementation(mockLogger.error);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockMap: Map = {
        mapId: 1,
        name: 'Test Map',
        size: 10,
        isVisible: true,
        description: 'Test Description',
        gameMode: 'Classic',
        tileMatrix: [
            [
                {
                    type: TileTypes.GROUND_0,
                    isOccupied: false,
                    isObstacle: false,
                    itemObject: null,
                },
            ],
        ],
        lastModified: new Date(),
        previewImage: 'test-image.png',
    };

    const mockResponse: MapResponse = {
        id: 1,
        mapVerification: {
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
        },
    };

    const mockService = {
        getAllMaps: jest.fn(),
        getMapById: jest.fn(),
        getAllMapsByVisibility: jest.fn(),
        saveMap: jest.fn(),
        updateMapVisibility: jest.fn(),
        updateMapImage: jest.fn(),
        deleteMap: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MapController],
            providers: [
                {
                    provide: MapService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<MapController>(MapController);
        service = module.get<MapService>(MapService);
    });

    describe('getAllMaps', () => {
        it('should successfully return all maps', async () => {
            mockService.getAllMaps.mockResolvedValue([mockMap]);
            const result = await controller.getAllMaps();
            expect(result).toEqual([mockMap]);
            expect(mockService.getAllMaps).toHaveBeenCalledTimes(1);
            expect(mockLogger.error).not.toHaveBeenCalled();
        });

        it('should handle and log database errors', async () => {
            const error = new Error('Database error');
            mockService.getAllMaps.mockRejectedValue(error);
            
            await expect(controller.getAllMaps()).rejects.toThrow(error);
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Failed to get all maps: Database error'
            );
        });
    });

    describe('getMapById', () => {
        it('should successfully return a map by id', async () => {
            mockService.getMapById.mockResolvedValue(mockMap);
            const result = await controller.getMapById(1);
            expect(result).toEqual(mockMap);
            expect(mockService.getMapById).toHaveBeenCalledWith(1);
            expect(mockLogger.error).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException when map is not found', async () => {
            mockService.getMapById.mockResolvedValue(null);
            
            await expect(controller.getMapById(1)).rejects.toThrow(NotFoundException);
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Failed to get map 1: Map with ID 1 not found'
            );
        });

        it('should handle and log database errors', async () => {
            const error = new Error('Database error');
            mockService.getMapById.mockRejectedValue(error);
            
            await expect(controller.getMapById(1)).rejects.toThrow(error);
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Failed to get map 1: Database error'
            );
        });
    });

    describe('getMapsByVisibility', () => {
        it('should successfully return visible maps', async () => {
            mockService.getAllMapsByVisibility.mockResolvedValue([mockMap]);
            const result = await controller.getMapsByVisibility();
            expect(result).toEqual([mockMap]);
            expect(mockService.getAllMapsByVisibility).toHaveBeenCalledTimes(1);
            expect(mockLogger.error).not.toHaveBeenCalled();
        });

        it('should handle and log database errors', async () => {
            const error = new Error('Database error');
            mockService.getAllMapsByVisibility.mockRejectedValue(error);
            
            await expect(controller.getMapsByVisibility()).rejects.toThrow(error);
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Failed to get maps by visibility : Database error'
            );
        });
    });

    describe('saveMap', () => {
        it('should successfully create a new map', async () => {
            mockService.saveMap.mockResolvedValue(mockResponse);
            const result = await controller.saveMap(mockMap);
            expect(result).toEqual(mockResponse);
            expect(mockService.saveMap).toHaveBeenCalledWith(mockMap);
            expect(mockLogger.error).not.toHaveBeenCalled();
        });

        it('should handle and log save errors', async () => {
            const error = new Error('Database error');
            mockService.saveMap.mockRejectedValue(error);
            
            await expect(controller.saveMap(mockMap)).rejects.toThrow(HttpException);
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Failed to create map: Database error',
                error.stack
            );
        });
    });

    describe('updateMapVisibility', () => {
        it('should successfully update map visibility', async () => {
            mockService.updateMapVisibility.mockResolvedValue(mockMap);
            await controller.updateMapVisibility(1, true);
            expect(mockService.updateMapVisibility).toHaveBeenCalledWith(1, true);
            expect(mockLogger.error).not.toHaveBeenCalled();
        });

        it('should handle and log visibility update errors', async () => {
            const error = new Error('Database error');
            mockService.updateMapVisibility.mockRejectedValue(error);
            
            await expect(controller.updateMapVisibility(1, true)).rejects.toThrow(error);
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Failed to update map 1 visibility: Database error'
            );
        });
    });

    describe('updatePreviewImage', () => {
        it('should successfully update map preview image', async () => {
            mockService.updateMapImage.mockResolvedValue(mockMap);
            const result = await controller.updatePreviewImage(1, 'new-image.png');
            expect(result).toEqual(mockMap);
            expect(mockService.updateMapImage).toHaveBeenCalledWith(1, 'new-image.png');
            expect(mockLogger.error).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException when map is not found', async () => {
            mockService.updateMapImage.mockResolvedValue(null);
            
            await expect(controller.updatePreviewImage(1, 'new-image.png')).rejects.toThrow(NotFoundException);
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Failed to update map 1 image: Map with ID 1 not found'
            );
        });

        it('should handle and log image update errors', async () => {
            const error = new Error('Database error');
            mockService.updateMapImage.mockRejectedValue(error);
            
            await expect(controller.updatePreviewImage(1, 'new-image.png')).rejects.toThrow(error);
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Failed to update map 1 image: Database error'
            );
        });
    });

    describe('deleteMap', () => {
        it('should successfully delete a map', async () => {
            mockService.deleteMap.mockResolvedValue(undefined);
            await controller.deleteMap(1);
            expect(mockService.deleteMap).toHaveBeenCalledWith(1);
            expect(mockLogger.error).not.toHaveBeenCalled();
        });

        it('should handle and log deletion errors', async () => {
            const error = new Error('Database error');
            mockService.deleteMap.mockRejectedValue(error);
            
            await expect(controller.deleteMap(1)).rejects.toThrow(error);
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Failed to delete map 1: Database error'
            );
        });
    });
});