import { Test } from '@nestjs/testing';
import { MapService } from './map.service';
import { Map } from '@common/map';
import { TileTypes } from '@common/tileType.constants';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import { jest } from '@jest/globals';

describe('MapService', () => {
  let mapService: MapService;
  
  const mockMapJson = {
    maps: [
      {
        id: 1,
        name: 'Test Map 1',
        size: 10,
        isVisible: true,
        description: 'First test map',
        gameMode: 'Classic' as const,
        tileMatrix: [],
        lastModified: new Date(),
        previewImage: 'preview1.jpg'
      },
      {
        id: 2,
        name: 'Test Map 2',
        size: 12,
        isVisible: false,
        description: 'Second test map',
        gameMode: 'CTF' as const,
        tileMatrix: [],
        lastModified: new Date(),
        previewImage: 'preview2.jpg'
      }
    ]
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MapService]
    }).compile();

    mapService = module.get<MapService>(MapService);
    
    // Mock file operations
    jest.spyOn(fs, 'readFile').mockResolvedValue(
      JSON.stringify(mockMapJson)
    );
    jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllMaps', () => {
    it('should return all maps', async () => {
      const maps = await mapService.getAllMaps();
      expect(maps.length).toBe(2);
      expect(maps[0].id).toBe(1);
      expect(maps[1].id).toBe(2);
    });

    it('should cache maps after first retrieval', async () => {
      await mapService.getAllMaps();
      await mapService.getAllMaps();
      
      expect(fs.readFile).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllMapsByVisibility', () => {
    it('should return only visible maps', async () => {
      const visibleMaps = await mapService.getAllMapsByVisibility();
      expect(visibleMaps.length).toBe(1);
      expect(visibleMaps[0].isVisible).toBe(true);
    });
  });

  describe('getMapById', () => {
    it('should return map when ID exists', async () => {
      await mapService.getAllMaps(); // Populate maps
      const map = await mapService.getMapById(1);
      expect(map).toBeDefined();
      expect(map.id).toBe(1);
    });

    it('should throw NotFoundException for non-existent map', async () => {
      await mapService.getAllMaps(); // Populate maps
      await expect(mapService.getMapById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('saveMap', () => {
    it('should update existing map', async () => {
      await mapService.getAllMaps(); // Populate maps
      const existingMap: Map = {
        id: 1,
        name: 'Updated Map Name',
        size: 10,
        isVisible: true,
        description: 'Updated description',
        gameMode: 'Classic',
        tileMatrix: [],
        lastModified: new Date(),
        previewImage: 'updated-preview.jpg'
      };

      const result = await mapService.saveMap(existingMap);
      expect(result.name).toBe('Updated Map Name');
      expect(result.id).toBe(1);
    });

    it('should create new map with generated ID', async () => {
      await mapService.getAllMaps(); // Populate maps
      const newMap: Map = {
        id: null,
        name: 'New Map',
        size: 15,
        isVisible: true,
        description: 'Brand new map',
        gameMode: 'CTF',
        tileMatrix: [],
        lastModified: new Date(),
        previewImage: 'new-preview.jpg'
      };

      const result = await mapService.saveMap(newMap);
      expect(result.id).toBeDefined();
      expect(result.name).toBe('New Map');
    });
  });

  describe('updateMapVisibility', () => {
    it('should update map visibility', async () => {
      await mapService.getAllMaps(); // Populate maps
      const result = await mapService.updateMapVisibility(1, false);
      expect(result.isVisible).toBe(false);
    });

    it('should throw NotFoundException for non-existent map', async () => {
      await mapService.getAllMaps(); // Populate maps
      await expect(mapService.updateMapVisibility(999, true)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMapImage', () => {
    it('should update map preview image', async () => {
      await mapService.getAllMaps(); // Populate maps
      const result = await mapService.updateMapImage(1, 'new-preview.jpg');
      expect(result.previewImage).toBe('new-preview.jpg');
    });

    it('should throw NotFoundException for non-existent map', async () => {
      await mapService.getAllMaps(); // Populate maps
      await expect(mapService.updateMapImage(999, 'new-preview.jpg')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMap', () => {
    it('should delete a map', async () => {
      await mapService.getAllMaps(); // Populate maps
      await mapService.deleteMap(1);
      
      const remainingMaps = await mapService.getAllMaps();
      expect(remainingMaps.length).toBe(1);
      expect(remainingMaps[0].id).toBe(2);
    });

    it('should throw NotFoundException for non-existent map', async () => {
      await mapService.getAllMaps(); // Populate maps
      await expect(mapService.deleteMap(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('parseTileMatrix', () => {
    it('should correctly parse tile matrix', () => {
      const parsedMatrix = mapService.parseTileMatrix(mockMapJson.maps[0]);
      expect(parsedMatrix.length).toBe(1);
      expect(parsedMatrix[0][0].type).toBe(TileTypes.GROUND_0);
      expect(parsedMatrix[0][0].isOccupied).toBe(false);
      expect(parsedMatrix[0][0].isObstacle).toBe(false);
    });
  });

  describe('loadMapFromJSON', () => {
    it('should correctly load map from JSON', () => {
      const loadedMap = mapService.loadMapFromJSON(mockMapJson.maps[0]);
      expect(loadedMap.id).toBe(1);
      expect(loadedMap.name).toBe('Test Map 1');
      expect(loadedMap.tileMatrix).toBeDefined();
    });
  });
});