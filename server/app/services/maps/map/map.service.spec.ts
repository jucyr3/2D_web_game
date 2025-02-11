import { Test, TestingModule } from '@nestjs/testing';
import { MapService } from './map.service';
import { MapVerificationService } from '@app/services/mapVerification/mapVerification.service';
import { MapDbService } from '@app/model/map-db/map-db.service';
import { Map } from '@common/map';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { TileTypes } from '@common/tileType.constants';

describe('MapService', () => {
    let service: MapService;
    let originalConsoleError: any;

    beforeAll(() => {
        originalConsoleError = console.error;
        console.error = jest.fn();
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    const mockMap: Map = {
        mapId: 1,
        name: 'Test Map',
        size: 10,
        isVisible: true,
        description: 'Test Description',
        gameMode: 'Classic',
        tileMatrix: [[{ type: TileTypes.GROUND_0, isOccupied: false, isObstacle: false, itemObject: null }]],
        lastModified: new Date(),
        previewImage: 'test-image.png',
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

    const mockMapDbService = {
        getAllMaps: jest.fn(),
        getVisible: jest.fn(),
        getMap: jest.fn(),
        addMap: jest.fn(),
        changeMap: jest.fn(),
        saveImage: jest.fn(),
        changeMapVisibility: jest.fn(),
        remove: jest.fn(),
    };

    const mockMapVerificationService = {
        setAllMapsNames: jest.fn(),
        removeMapName: jest.fn(),
        validateGame: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MapService,
                { provide: MapVerificationService, useValue: mockMapVerificationService },
                { provide: MapDbService, useValue: mockMapDbService },
                { 
                    provide: Logger, 
                    useValue: { 
                        log: jest.fn(),
                        error: jest.fn(),
                        warn: jest.fn(),
                        debug: jest.fn(),
                        verbose: jest.fn()
                    } 
                }
            ],
        }).compile();

        service = module.get<MapService>(MapService);
    });

    describe('getAllMaps', () => {
        it('should return all maps', async () => {
            mockMapDbService.getAllMaps.mockResolvedValue([mockMap]);
            const result = await service.getAllMaps();
            expect(result).toEqual([mockMap]);
        });

        it('should handle database error', async () => {
            mockMapDbService.getAllMaps.mockRejectedValue({ message: 'Database error' });
            await expect(service.getAllMaps()).rejects.toThrow();
        });
    });

    describe('getAllMapsByVisibility', () => {
        it('should return visible maps', async () => {
            mockMapDbService.getVisible.mockResolvedValue([mockMap]);
            const result = await service.getAllMapsByVisibility();
            expect(result).toEqual([mockMap]);
        });

        it('should handle database error', async () => {
            mockMapDbService.getVisible.mockRejectedValue({ message: 'Database error' });
            await expect(service.getAllMapsByVisibility()).rejects.toThrow();
        });
    });

    describe('getMapById', () => {
        it('should return a map', async () => {
            mockMapDbService.getMap.mockResolvedValue(mockMap);
            const result = await service.getMapById(1);
            expect(result).toEqual(mockMap);
        });

        it('should handle map not found', async () => {
            mockMapDbService.getMap.mockResolvedValue(null);
            await expect(service.getMapById(1)).rejects.toThrow(NotFoundException);
        });

        it('should handle database error', async () => {
            mockMapDbService.getMap.mockRejectedValue({ message: 'Database error' });
            await expect(service.getMapById(1)).rejects.toThrow();
        });
    });

    describe('saveMap', () => {
        it('should save new map', async () => {
            mockMapDbService.getAllMaps.mockResolvedValue([]);
            mockMapVerificationService.validateGame.mockReturnValue(mockVerification);
            mockMapDbService.addMap.mockResolvedValue(undefined);
            mockMapDbService.saveImage.mockResolvedValue(undefined);

            const result = await service.saveMap(mockMap);
            expect(result.mapVerification).toEqual(mockVerification);
        });

        it('should update existing map', async () => {
            mockMapDbService.getAllMaps.mockResolvedValue([mockMap]);
            mockMapVerificationService.validateGame.mockReturnValue(mockVerification);
            mockMapDbService.changeMap.mockResolvedValue(undefined);

            const result = await service.saveMap(mockMap);
            expect(result.mapVerification).toEqual(mockVerification);
        });

        it('should handle validation failure for new map', async () => {
            const failedVerification = { ...mockVerification, isUniqueName: false };
            mockMapDbService.getAllMaps.mockResolvedValue([]);
            mockMapVerificationService.validateGame.mockReturnValue(failedVerification);

            const result = await service.saveMap(mockMap);
            expect(result).toEqual({
                id: 0,
                mapVerification: failedVerification,
            });
        });

        it('should handle validation failure for existing map', async () => {
            const failedVerification = { ...mockVerification, isUniqueName: false };
            mockMapDbService.getAllMaps.mockResolvedValue([mockMap]);
            mockMapVerificationService.validateGame.mockReturnValue(failedVerification);

            const result = await service.saveMap(mockMap);
            expect(result).toEqual({
                id: mockMap.mapId,
                mapVerification: failedVerification,
            });
        });

        it('should handle bad request error', async () => {
            mockMapDbService.getAllMaps.mockRejectedValue(new BadRequestException());
            await expect(service.saveMap(mockMap)).rejects.toThrow(BadRequestException);
        });

        it('should handle database error', async () => {
            mockMapDbService.getAllMaps.mockRejectedValue({ message: 'Database error' });
            await expect(service.saveMap(mockMap)).rejects.toThrow();
        });
    });

    describe('updateMapVisibility', () => {
        it('should update visibility', async () => {
            mockMapDbService.changeMapVisibility.mockResolvedValue(undefined);
            mockMapDbService.getMap.mockResolvedValue(mockMap);
            const result = await service.updateMapVisibility(1, true);
            expect(result).toEqual(mockMap);
        });

        it('should handle not found error', async () => {
            mockMapDbService.changeMapVisibility.mockRejectedValue(new NotFoundException());
            await expect(service.updateMapVisibility(1, true)).rejects.toThrow(NotFoundException);
        });

        it('should handle database error', async () => {
            mockMapDbService.changeMapVisibility.mockRejectedValue({ message: 'Database error' });
            await expect(service.updateMapVisibility(1, true)).rejects.toThrow();
        });
    });

    describe('updateMapImage', () => {
        it('should update image', async () => {
            mockMapDbService.saveImage.mockResolvedValue(undefined);
            mockMapDbService.getMap.mockResolvedValue(mockMap);
            const result = await service.updateMapImage(1, 'new.png');
            expect(result).toEqual(mockMap);
        });

        it('should handle not found error', async () => {
            mockMapDbService.saveImage.mockRejectedValue(new NotFoundException());
            await expect(service.updateMapImage(1, 'new.png')).rejects.toThrow(NotFoundException);
        });

        it('should handle database error', async () => {
            mockMapDbService.saveImage.mockRejectedValue({ message: 'Database error' });
            await expect(service.updateMapImage(1, 'new.png')).rejects.toThrow();
        });
    });

    describe('deleteMap', () => {
        it('should delete map', async () => {
            mockMapDbService.remove.mockResolvedValue(undefined);
            await service.deleteMap(1);
            expect(mockMapDbService.remove).toHaveBeenCalledWith(1);
        });

        it('should handle not found error', async () => {
            mockMapDbService.remove.mockRejectedValue(new NotFoundException());
            await expect(service.deleteMap(1)).rejects.toThrow(NotFoundException);
        });

        it('should handle database error', async () => {
            mockMapDbService.remove.mockRejectedValue({ message: 'Database error' });
            await expect(service.deleteMap(1)).rejects.toThrow();
        });
    });

    describe('private methods', () => {
        it('should transform map data', () => {
            const result = (service as any).transformToMap(mockMap);
            expect(result).toEqual(mockMap);
        });

        it('should handle missing tileMatrix', () => {
            const mapWithoutMatrix = { ...mockMap, tileMatrix: undefined };
            const result = (service as any).transformToMap(mapWithoutMatrix);
            expect(result.tileMatrix).toEqual([[]]);
        });
    });
});