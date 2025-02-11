import { Test, TestingModule } from '@nestjs/testing';
import { MapService } from './map.service';
import { MapDbService } from '@app/model/map-db/map-db.service';
import { MapVerificationService } from '@app/services/mapVerification/mapVerification.service';
import { Map } from '@common/map';
import { NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { MapVerification } from '@common/mapVerification.interface';

describe('MapService', () => {
    let mapService: MapService;
    let mapDbService: jest.Mocked<MapDbService>;
    let mapVerificationService: jest.Mocked<MapVerificationService>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockMap: any = {
        mapId: 1,
        name: 'Test Map',
        size: 10,
        isVisible: true,
        description: 'Test Description',
        gameMode: 'Test Mode',
        tileMatrix: [[]],
        lastModified: new Date(),
        previewImage: 'test-image.png',
    };

    const mockMapVerificationPassed: MapVerification = {
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

    const mockMapVerificationFailed: MapVerification = {
        isUniqueName: false,
        isNamePresent: false,
        isDescriptionPresent: false,
        isMapHalfFloor: false,
        isMapAccessible: false,
        areStartingPointsValid: false,
        areItemsValid: false,
        areDoorsNextToWalls: false,
        areDoorsNotNextToBorder: false,
        isNameValid: false,
        isDescriptionValid: false,
        isFlagPresent: false,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MapService,
                {
                    provide: MapDbService,
                    useValue: {
                        getAllMaps: jest.fn(),
                        getVisible: jest.fn(),
                        getMap: jest.fn(),
                        changeMap: jest.fn(),
                        addMap: jest.fn(),
                        saveImage: jest.fn(),
                        changeMapVisibility: jest.fn(),
                        remove: jest.fn(),
                    },
                },
                {
                    provide: MapVerificationService,
                    useValue: {
                        setAllMapsNames: jest.fn(),
                        removeMapName: jest.fn(),
                        validateGame: jest.fn(),
                    },
                },
            ],
        }).compile();

        mapService = module.get<MapService>(MapService);
        mapDbService = module.get(MapDbService) as jest.Mocked<MapDbService>;
        mapVerificationService = module.get(MapVerificationService) as jest.Mocked<MapVerificationService>;
    });

    describe('getAllMaps', () => {
        it('should return all maps', async () => {
            mapDbService.getAllMaps.mockResolvedValue([mockMap]);
            mapService['transformToMap'] = jest.fn().mockReturnValue(mockMap);
            const result = await mapService.getAllMaps();
            expect(result).toEqual([mockMap]);
            expect(mapVerificationService.setAllMapsNames).toHaveBeenCalled();
        });

        it('should throw an error if getAllMaps fails', async () => {
            mapDbService.getAllMaps.mockRejectedValue(new Error('Database error'));

            await expect(mapService.getAllMaps()).rejects.toThrow('Failed to retrieve maps: Database error');
        });
    });

    describe('getAllMapsByVisibility', () => {
        it('should return visible maps', async () => {
            mapDbService.getVisible.mockResolvedValue([mockMap]);
            const result = await mapService.getAllMapsByVisibility();
            expect(result).toEqual([mockMap]);
        });

        it('should throw an error if getVisible fails', async () => {
            mapDbService.getVisible.mockRejectedValue(new Error('Database error'));
            await expect(mapService.getAllMapsByVisibility()).rejects.toThrow('Failed to retrieve maps by visibility');
        });
    });

    describe('getMapById', () => {
        it('should return a map by id', async () => {
            mapDbService.getMap.mockResolvedValue(mockMap);
            const result = await mapService.getMapById(1);
            expect(result).toEqual(mockMap);
        });

        it('should throw NotFoundException if map is not found', async () => {
            mapDbService.getMap.mockResolvedValue(null);
            await expect(mapService.getMapById(1)).rejects.toThrow(NotFoundException);
        });

        it('should throw an error if getMap fails', async () => {
            mapDbService.getMap.mockRejectedValue(new Error('Database error'));
            await expect(mapService.getMapById(1)).rejects.toThrow('Failed to retrieve map: Database error');
        });
    });

    describe('saveMap', () => {
        it('should save a new map', async () => {
            mapDbService.getAllMaps.mockResolvedValue([]);
            mapVerificationService.validateGame.mockReturnValue(mockMapVerificationPassed);
            mapDbService.addMap.mockResolvedValue(undefined);
            mapDbService.saveImage.mockResolvedValue(undefined);

            const result = await mapService.saveMap(mockMap);
            expect(result.id).toBeDefined();
            expect(result.mapVerification).toEqual(mockMapVerificationPassed);
        });

        it('should update an existing map', async () => {
            mapDbService.getAllMaps.mockResolvedValue([mockMap]);
            mapVerificationService.validateGame.mockReturnValue(mockMapVerificationPassed);
            mapDbService.changeMap.mockResolvedValue(undefined);

            const result = await mapService.saveMap(mockMap);
            expect(result.id).toEqual(mockMap.mapId);
            expect(result.mapVerification).toEqual(mockMapVerificationPassed);
        });

        it('should return validation errors if map is invalid', async () => {
            mapDbService.getAllMaps.mockResolvedValue([]);
            mapVerificationService.validateGame.mockReturnValue(mockMapVerificationFailed);

            const result = await mapService.saveMap(mockMap);
            expect(result.id).toEqual(0);
            expect(result.mapVerification).toEqual(mockMapVerificationFailed);
        });

        it('should return mapResponse with existing map id when validation fails and map already exists', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const existingMap: any = {
                mapId: 1,
                name: 'Existing Map',
                size: 10,
                isVisible: true,
                description: 'Test Map',
                gameMode: 'Classic',
                tileMatrix: [[]],
                lastModified: new Date(),
                previewImage: 'imageData',
            };

            const newMap: Map = { ...existingMap, name: 'Updated Map' };

            mapDbService.getAllMaps.mockResolvedValue([existingMap]);
            mapVerificationService.validateGame.mockReturnValue(mockMapVerificationFailed);

            const result = await mapService.saveMap(newMap);

            expect(result).toEqual({ id: existingMap.mapId, mapVerification: mockMapVerificationFailed });
            expect(mapVerificationService.removeMapName).toHaveBeenCalledWith(existingMap.name);
        });

        it('should throw BadRequestException if encountered', async () => {
            const newMap: Map = {
                mapId: 2,
                name: 'New Map',
                size: 10,
                isVisible: true,
                description: 'Test Map',
                gameMode: 'Classic',
                tileMatrix: [[]],
                lastModified: new Date(),
                previewImage: 'imageData',
            };

            mapDbService.getAllMaps.mockRejectedValue(new BadRequestException('Invalid map data'));

            await expect(mapService.saveMap(newMap)).rejects.toThrow(BadRequestException);
        });

        it('should throw generic error if an unknown error occurs', async () => {
            const newMap: Map = {
                mapId: 3,
                name: 'Another New Map',
                size: 10,
                isVisible: true,
                description: 'Test Map',
                gameMode: 'Classic',
                tileMatrix: [[]],
                lastModified: new Date(),
                previewImage: 'imageData',
            };

            mapDbService.getAllMaps.mockRejectedValue(new Error('Unexpected error'));

            await expect(mapService.saveMap(newMap)).rejects.toThrow('Failed to create map: Unexpected error');
        });
    });

    describe('updateMapVisibility', () => {
        let consoleErrorSpy;
        let loggerSpy;

        beforeEach(() => {
            // Silence console.error before each test
            consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
        });

        afterEach(() => {
            // Restore all mocks
            consoleErrorSpy.mockRestore();
            loggerSpy.mockRestore();
        });

        it('should update map visibility', async () => {
            mapDbService.changeMapVisibility.mockResolvedValue(undefined);
            mapDbService.getMap.mockResolvedValue(mockMap);
            mapService['transformToMap'] = jest.fn().mockReturnValue(mockMap);

            const result = await mapService.updateMapVisibility(1, true);
            expect(result).toEqual(mockMap);
            expect(mapDbService.changeMapVisibility).toHaveBeenCalledWith(1, true);
        });

        it('should throw NotFoundException if map is not found', async () => {
            mapDbService.getMap.mockResolvedValue(null);

            await expect(mapService.updateMapVisibility(1, true)).rejects.toThrow(NotFoundException);
        });

        it('should throw a generic error if an unexpected error occurs', async () => {
            mapDbService.changeMapVisibility.mockRejectedValue(new Error('Database failure'));

            await expect(mapService.updateMapVisibility(1, true)).rejects.toThrow('Failed to update map visibility: Database failure');
        });
    });

    describe('updateMapImage', () => {
        it('should update map image', async () => {
            mapDbService.saveImage.mockResolvedValue(undefined);
            mapDbService.getMap.mockResolvedValue({ ...mockMap, previewImage: 'new-image.png' });

            const result = await mapService.updateMapImage(1, 'new-image.png');
            expect(result.previewImage).toBe('new-image.png');
        });

        it('should throw NotFoundException if map is not found', async () => {
            mapDbService.saveImage.mockRejectedValue(new NotFoundException());
            await expect(mapService.updateMapImage(1, 'new-image.png')).rejects.toThrow(NotFoundException);
        });

        it('should throw an error with custom message if saveImage fails', async () => {
            const errorMessage = 'Failed to save image';
            mapDbService.saveImage.mockRejectedValue(new Error(errorMessage));

            await expect(mapService.updateMapImage(1, 'new-image.png')).rejects.toThrow(`Failed to update map image: ${errorMessage}`);
        });
    });

    describe('deleteMap', () => {
        it('should delete a map', async () => {
            mapDbService.remove.mockResolvedValue(undefined);
            await expect(mapService.deleteMap(1)).resolves.not.toThrow();
        });

        it('should throw NotFoundException if map is not found', async () => {
            mapDbService.remove.mockRejectedValue(new NotFoundException());

            await expect(mapService.deleteMap(1)).rejects.toThrow(NotFoundException);
        });

        it('should throw an error with custom message if deletion fails', async () => {
            const errorMessage = 'Database connection failed';
            mapDbService.remove.mockRejectedValue(new Error(errorMessage));

            await expect(mapService.deleteMap(1)).rejects.toThrow(`Failed to delete map: ${errorMessage}`);
        });
    });
});
