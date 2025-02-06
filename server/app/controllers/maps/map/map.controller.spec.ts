import { Test, TestingModule } from '@nestjs/testing';
import { MapController } from './map.controller';
import { MapService } from '@app/services/maps/map/map.service';
import { Map } from '@common/map';
import { NotFoundException } from '@nestjs/common';

fdescribe('MapController', () => {
  let mapController: MapController;
  let mapService: MapService;

  const mockMapService = {
    getAllMaps: jest.fn(),
    getMapById: jest.fn(),
    getAllMapsByVisibility: jest.fn(),
    saveMap: jest.fn(),
    updateMapVisibility: jest.fn(),
    updateMapImage: jest.fn(),
    deleteMap: jest.fn()
  };

  const mockMaps: Map[] = [
    {
      id: 1,
      name: 'Test Map 1',
      size: 10,
      isVisible: true,
      description: 'First test map',
      gameMode: 'Classic',
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
      gameMode: 'CTF',
      tileMatrix: [],
      lastModified: new Date(),
      previewImage: 'preview2.jpg'
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapController],
      providers: [
        {
          provide: MapService,
          useValue: mockMapService
        }
      ]
    }).compile();

    mapController = module.get<MapController>(MapController);
    mapService = module.get<MapService>(MapService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllMaps', () => {
    it('should return all maps', async () => {
      mockMapService.getAllMaps.mockResolvedValue(mockMaps);

      const result = await mapController.getAllMaps();
      expect(result).toEqual(mockMaps);
      expect(mockMapService.getAllMaps).toHaveBeenCalled();
    });
  });

  describe('getMapById', () => {
    it('should return a map by ID', async () => {
      const mockMap = mockMaps[0];
      mockMapService.getMapById.mockResolvedValue(mockMap);

      const result = await mapController.getMapById(1);
      expect(result).toEqual(mockMap);
      expect(mockMapService.getMapById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for non-existent map', async () => {
      mockMapService.getMapById.mockRejectedValue(new NotFoundException('Map not found'));

      await expect(mapController.getMapById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMapsByVisibility', () => {
    it('should return visible maps', async () => {
      const visibleMaps = mockMaps.filter(map => map.isVisible);
      mockMapService.getAllMapsByVisibility.mockResolvedValue(visibleMaps);

      const result = await mapController.getMapsByVisibility();
      expect(result).toEqual(visibleMaps);
      expect(mockMapService.getAllMapsByVisibility).toHaveBeenCalled();
    });
  });

  describe('saveMap', () => {
    it('should create a new map', async () => {
      const newMap = mockMaps[0];
      mockMapService.saveMap.mockResolvedValue(newMap);

      const result = await mapController.saveMap(newMap);
      expect(result).toEqual(newMap);
      expect(mockMapService.saveMap).toHaveBeenCalledWith(newMap);
    });
  });

  describe('updateMapVisibility', () => {
    it('should update map visibility', async () => {
      const updatedMap = { ...mockMaps[0], isVisible: false };
      mockMapService.updateMapVisibility.mockResolvedValue(updatedMap);

      const result = await mapController.updateMapVisibility(1, false);
      expect(result).toEqual(updatedMap);
      expect(mockMapService.updateMapVisibility).toHaveBeenCalledWith(1, false);
    });
  });

  describe('updatePreviewImage', () => {
    it('should update map preview image', async () => {
      const updatedMap = { ...mockMaps[0], previewImage: 'new-preview.jpg' };
      mockMapService.updateMapImage.mockResolvedValue(updatedMap);

      const result = await mapController.updatePreviewImage(1, 'new-preview.jpg');
      expect(result).toEqual(updatedMap);
      expect(mockMapService.updateMapImage).toHaveBeenCalledWith(1, 'new-preview.jpg');
    });
  });

  describe('deleteMap', () => {
    it('should delete a map', async () => {
      mockMapService.deleteMap.mockResolvedValue(undefined);

      await expect(mapController.deleteMap(1)).resolves.toBeUndefined();
      expect(mockMapService.deleteMap).toHaveBeenCalledWith(1);
    });
  });
});