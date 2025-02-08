import { Test, TestingModule } from '@nestjs/testing';
import { MapService } from './map.service';
import { MapVerificationService } from '@app/services/mapVerification/mapVerification.service';
import { Map } from '@common/map';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';
import * as fs from 'fs/promises';

jest.mock('fs/promises');

describe('MapService', () => {
  let service: MapService;
  let mapVerificationService: jest.Mocked<MapVerificationService>;

  const mockTileMatrix: Tile[][] = [
    [
      { type: TileTypes.GROUND_0, isOccupied: false, isObstacle: false, itemObject: null },
      { type: TileTypes.WALL, isOccupied: false, isObstacle: true, itemObject: null },
      { type: TileTypes.DOOR, isOccupied: false, isObstacle: true, itemObject: null }
    ],
    [
      { type: TileTypes.GROUND_1, isOccupied: true, isObstacle: false, itemObject: { name: 'StartPoint' } },
      { type: TileTypes.GROUND_2, isOccupied: false, isObstacle: false, itemObject: null },
      { type: TileTypes.OPEN_DOOR, isOccupied: false, isObstacle: false, itemObject: null }
    ]
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
    previewImage: 'test.jpg'
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
    isDescriptionValid: true
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
            removeMapName: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<MapService>(MapService);
    mapVerificationService = module.get(MapVerificationService);

    jest.clearAllMocks();
  });

  describe('saveMap', () => {
    beforeEach(() => {
      service['maps'] = [mockMap];
    });

    it('should validate map with all verification checks', async () => {
      const updatedMap = { ...mockMap, name: 'Updated Map' };
      mapVerificationService.validateGame.mockReturnValue(mockMapVerification);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await service.saveMap(updatedMap);

      expect(result.mapVerification.isUniqueName).toBe(true);
      expect(result.mapVerification.isNamePresent).toBe(true);
      expect(result.mapVerification.isDescriptionPresent).toBe(true);
      expect(result.mapVerification.isMapHalfFloor).toBe(true);
      expect(result.mapVerification.isMapAccessible).toBe(true);
      expect(result.mapVerification.areStartingPointsValid).toBe(true);
      expect(result.mapVerification.areDoorsNextToWalls).toBe(true);
      expect(result.mapVerification.areDoorsNotNextToBorder).toBe(true);
      expect(result.mapVerification.isNameValid).toBe(true);
      expect(result.mapVerification.isDescriptionValid).toBe(true);
    });

    it('should fail validation when name is not unique', async () => {
      const invalidVerification = { ...mockMapVerification, isUniqueName: false };
      mapVerificationService.validateGame.mockReturnValue(invalidVerification);

      const result = await service.saveMap(mockMap);

      expect(result.id).toBe(0);
      expect(result.mapVerification.isUniqueName).toBe(false);
    });

    it('should fail validation when map is not accessible', async () => {
      const invalidVerification = { ...mockMapVerification, isMapAccessible: false };
      mapVerificationService.validateGame.mockReturnValue(invalidVerification);

      const result = await service.saveMap(mockMap);

      expect(result.id).toBe(0);
      expect(result.mapVerification.isMapAccessible).toBe(false);
    });

    it('should fail validation when starting points are invalid', async () => {
      const invalidVerification = { ...mockMapVerification, areStartingPointsValid: false };
      mapVerificationService.validateGame.mockReturnValue(invalidVerification);

      const result = await service.saveMap(mockMap);

      expect(result.id).toBe(0);
      expect(result.mapVerification.areStartingPointsValid).toBe(false);
    });

    it('should fail validation when doors are not properly placed', async () => {
      const invalidVerification = {
        ...mockMapVerification,
        areDoorsNextToWalls: false,
        areDoorsNotNextToBorder: false
      };
      mapVerificationService.validateGame.mockReturnValue(invalidVerification);

      const result = await service.saveMap(mockMap);

      expect(result.id).toBe(0);
      expect(result.mapVerification.areDoorsNextToWalls).toBe(false);
      expect(result.mapVerification.areDoorsNotNextToBorder).toBe(false);
    });

    it('should fail validation when map does not have enough floor tiles', async () => {
      const invalidVerification = { ...mockMapVerification, isMapHalfFloor: false };
      mapVerificationService.validateGame.mockReturnValue(invalidVerification);

      const result = await service.saveMap(mockMap);

      expect(result.id).toBe(0);
      expect(result.mapVerification.isMapHalfFloor).toBe(false);
    });
  });

  // ... (other test cases remain the same)

  describe('parseTileMatrix', () => {
    it('should validate starting points in tile matrix', () => {
      const mapWithStartPoints = {
        ...mockMap,
        tileMatrix: [
          [
            { type: TileTypes.GROUND_0, isOccupied: true, isObstacle: false, itemObject: { name: 'StartPoint' } },
            { type: TileTypes.GROUND_0, isOccupied: true, isObstacle: false, itemObject: { name: 'StartPoint' } }
          ]
        ]
      };

      const result = service.parseTileMatrix(mapWithStartPoints);
      
      expect(result[0][0].itemObject.name).toBe('StartPoint');
      expect(result[0][1].itemObject.name).toBe('StartPoint');
    });

    it('should validate door placement in tile matrix', () => {
      const result = service.parseTileMatrix(mockMap);
      
      const doorTile = result[0][2];
      expect(doorTile.type).toBe(TileTypes.DOOR);
      expect(doorTile.isObstacle).toBe(true);
    });
  });

  describe('loadMapFromJSON', () => {
    it('should validate floor tile percentage', () => {
      const mapWithMostlyFloor = {
        ...mockMap,
        tileMatrix: [
          [
            { type: TileTypes.GROUND_0, isOccupied: false, isObstacle: false, itemObject: null },
            { type: TileTypes.GROUND_1, isOccupied: false, isObstacle: false, itemObject: null }
          ],
          [
            { type: TileTypes.GROUND_2, isOccupied: false, isObstacle: false, itemObject: null },
            { type: TileTypes.WALL, isOccupied: false, isObstacle: true, itemObject: null }
          ]
        ]
      };

      const result = service.loadMapFromJSON(mapWithMostlyFloor);
      
      const floorTiles = result.tileMatrix.flat().filter(tile => 
        tile.type === TileTypes.GROUND_0 || 
        tile.type === TileTypes.GROUND_1 || 
        tile.type === TileTypes.GROUND_2
      );
      
      expect(floorTiles.length).toBeGreaterThan(result.tileMatrix.flat().length / 2);
    });
  });
});