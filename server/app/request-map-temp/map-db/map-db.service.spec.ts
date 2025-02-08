import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken,getConnectionToken,MongooseModule } from '@nestjs/mongoose';
import { Model,Connection } from 'mongoose';
import { MapDbService } from './map-db.service';
import { MapDocument } from './map.interface';
import { mapSchema } from './map.schema';

import { Logger, NotFoundException } from '@nestjs/common';
import { Map } from '@common/map';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('MapDbService', () => {
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
        const map: Map = new Map('New Map', 10, true, 'Description', 'CTF');
        const createStub = jest.spyOn(mapModel, 'create').mockResolvedValueOnce(map as any);
        const result = await service.addMap(map);
        expect(createStub).toHaveBeenCalled();
        expect(result).toEqual(map);
    });

    it('should get all maps', async () => {
        const maps = [{ name: 'Test Map', isVisible: true, previewImage: '' }];
        const findSpy =jest.spyOn(mapModel, 'find').mockResolvedValueOnce(maps);
        const result = await service.getAllMap();
        expect(findSpy).toHaveBeenCalled();
        expect(result).toEqual(maps);
    });

    it('should get a map by id', async () => {
        const map = new Map('Test Map', 10, true, 'Description', 'CTF');
        const findByIdSpy = jest.spyOn(mapModel, 'findById').mockResolvedValueOnce(map);
        const result = await service.getMap('1');
        expect(findByIdSpy).toHaveBeenCalled();
        expect(result).toEqual(map);
    });

    it('should throw an error if getMap fails', async () => {
        const findByIdStub = jest.spyOn(mapModel, 'findById');
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
        const map: Map = new Map('Updated Map',10, true,'Description',"CTF");
        const updateOneStub = jest.spyOn(mapModel, 'updateOne').mockResolvedValueOnce({ nModified: 1 } as any);
        const result = await service.changeMap('1', map);
        expect(updateOneStub).toHaveBeenCalled();
        expect(result).toEqual({ nModified: 1 });
    });

    it('should remove a map', async () => {
        const deleteOneStub = jest.spyOn(mapModel, 'deleteOne').mockResolvedValueOnce({ deletedCount: 1 } as any);
        const result = await service.remove('1');
        expect(deleteOneStub).toHaveBeenCalled();
        expect(result).toEqual({ deletedCount: 1 });
    });

    it('should save an image', async () => {
        const updateOneStub = jest.spyOn(mapModel, 'updateOne').mockResolvedValueOnce({ nModified: 1 } as any);
        const result = await service.saveImage('1', 'image-data');
        expect(updateOneStub).toHaveBeenCalled();
        expect(result).toEqual({ nModified: 1 });
    });

    it('should get an image by id', async () => {
        const image = { previewImage: 'image-data' };
        const findByIdStub = jest.spyOn(mapModel, 'findById').mockResolvedValueOnce(image);
        const result = await service.getImage('1');
        expect(findByIdStub).toHaveBeenCalled();
        expect(result).toEqual('image-data');
    });
});
