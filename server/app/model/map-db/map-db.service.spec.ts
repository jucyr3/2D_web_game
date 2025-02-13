import { Map } from '@common/map';
import { Logger, NotFoundException } from '@nestjs/common';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model } from 'mongoose';
import { MapDbService } from './map-db.service';
import { MapDocument } from './map.interface';
import { mapSchema } from './map.schema';

describe('MapDbService', () => {
    const MAP_SIZE = 10;
    let service: MapDbService;
    let mapModel: Model<MapDocument>;
    let mongoServer: MongoMemoryServer;
    let connection: Connection;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        // notice that only the functions we call from the model are mocked
        // we can´t use sinon because mongoose Model is an interface
        const module = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: () => ({
                        uri: mongoServer.getUri(),
                    }),
                }),
                MongooseModule.forFeature([{ name: 'Map', schema: mapSchema }]),
            ],
            providers: [MapDbService, Logger],
        }).compile();

        service = module.get<MapDbService>(MapDbService);

        mapModel = module.get<Model<MapDocument>>(getModelToken('Map'));
        connection = await module.get(getConnectionToken());
    });

    afterEach(async () => {
        await mapModel.deleteMany({});
    });
    afterAll(async () => {
        await connection.close();
        await mongoServer.stop({ doCleanup: true });
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(mapModel).toBeDefined();
    });

    it('should add a map', async () => {
        const map: Map = {
            mapId: '1',
            name: 'Test Map',
            size: MAP_SIZE,
            isVisible: true,
            description: 'Description',
            gameMode: 'CTF',
            tileMatrix: [],
            lastModified: new Date(),
            previewImage: 'test-preview.png',
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const createStub = jest.spyOn(mapModel, 'create').mockResolvedValueOnce(map as any);
        const result = await service.addMap(map);
        expect(createStub).toHaveBeenCalled();
        expect(result).toEqual(map);
    });

    it('should get all maps', async () => {
        const maps = [{ name: 'Test Map', isVisible: true, previewImage: '' }];
        const findSpy = jest.spyOn(mapModel, 'find').mockResolvedValueOnce(maps);
        const result = await service.getAllMaps();
        expect(findSpy).toHaveBeenCalled();
        expect(result).toEqual(maps);
    });

    it('should get a map by id', async () => {
        const map: Map = {
            mapId: '1',
            name: 'Test Map',
            size: MAP_SIZE,
            isVisible: true,
            description: 'Description',
            gameMode: 'CTF',
            tileMatrix: [],
            lastModified: new Date(),
            previewImage: 'test-preview.png',
        };
        const findByIdSpy = jest.spyOn(mapModel, 'findOne').mockResolvedValueOnce(map);
        const result = await service.getMap('1');
        expect(findByIdSpy).toHaveBeenCalled();
        expect(result).toEqual(map);
    });

    it('should throw an error if getMap fails', async () => {
        const findByIdStub = jest.spyOn(mapModel, 'findOne');
        findByIdStub.mockImplementation(() => {
            throw new Error('error');
        });
        await expect(service.getMap('1')).rejects.toThrow('Map not found');
    });

    it('should throw NotFoundException if map not found by id', async () => {
        jest.spyOn(mapModel, 'findById').mockResolvedValueOnce(null);
        await expect(service.getMap('1')).rejects.toThrow(NotFoundException);
    });

    it('should get visible maps', async () => {
        const maps = [{ name: 'Test Map', isVisible: true, previewImage: '' }];
        const findStub = jest.spyOn(mapModel, 'find').mockResolvedValueOnce(maps);
        const result = await service.getVisible();
        expect(findStub).toHaveBeenCalled();
        expect(result).toEqual(maps);
    });
    it('should return [] if response is null or undefined in getVisible', async () => {
        const findStub = jest.spyOn(mapModel, 'find').mockResolvedValueOnce(null);
        const result = await service.getVisible();
        expect(findStub).toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('should change a map', async () => {
        const map: Map = {
            mapId: '1',
            name: 'Test Map',
            size: MAP_SIZE,
            isVisible: true,
            description: 'Description',
            gameMode: 'CTF',
            tileMatrix: [],
            lastModified: new Date(),
            previewImage: 'test-preview.png',
        };
        const updateResult = { acknowledged: true, modifiedCount: 1, upsertedId: null, upsertedCount: 0, matchedCount: 1 };
        const updateOneStub = jest.spyOn(mapModel, 'updateOne').mockResolvedValueOnce(updateResult);
        const result = await service.changeMap('1', map);
        expect(updateOneStub).toHaveBeenCalled();
        expect(result).toEqual(updateResult);
    });

    it('should remove a map', async () => {
        const deleteResult = { acknowledged: true, deletedCount: 1 };
        const deleteOneStub = jest.spyOn(mapModel, 'deleteOne').mockResolvedValueOnce(deleteResult);
        const result = await service.remove('1');
        expect(deleteOneStub).toHaveBeenCalled();
        expect(result).toEqual(deleteResult);
    });

    it('should save an image', async () => {
        const updateResult = { acknowledged: true, modifiedCount: 1, upsertedId: null, upsertedCount: 0, matchedCount: 1 };
        const updateOneStub = jest.spyOn(mapModel, 'updateOne').mockResolvedValueOnce(updateResult);
        const result = await service.saveImage('1', 'image-data');
        expect(updateOneStub).toHaveBeenCalled();
        expect(result).toEqual(updateResult);
    });

    it('should get an image by id', async () => {
        const image = { previewImage: 'image-data' };
        const findByIdStub = jest.spyOn(mapModel, 'findOne').mockResolvedValueOnce(image);
        const result = await service.getImage('1');
        expect(findByIdStub).toHaveBeenCalled();
        expect(result).toEqual({ previewImage: 'image-data' });
    });

    it('should change map visibility', async () => {
        const updateResult = { acknowledged: true, modifiedCount: 1, upsertedId: null, upsertedCount: 0, matchedCount: 1 };
        const updateOneStub = jest.spyOn(mapModel, 'updateOne').mockResolvedValueOnce(updateResult);
        const result = await service.changeMapVisibility('1', true);
        expect(updateOneStub).toHaveBeenCalledWith({ mapId: '1' }, { $set: { isVisible: true } });
        expect(result).toEqual(updateResult);
    });

    it('should handle error when changing map visibility', async () => {
        jest.spyOn(mapModel, 'updateOne').mockImplementationOnce(() => {
            throw new Error('error');
        });
        await expect(service.changeMapVisibility('1', true)).rejects.toThrow('error');
    });

    it('should throw NotFoundException if map is not found (null response)', async () => {
        const mockId = '1';

        // Mock the findOne method to return null (map not found)
        jest.spyOn(mapModel, 'findOne').mockResolvedValue(null);

        // Call getMap and expect NotFoundException to be thrown
        await expect(service.getMap(mockId)).rejects.toThrowError(new NotFoundException('No map found'));
    });
});
