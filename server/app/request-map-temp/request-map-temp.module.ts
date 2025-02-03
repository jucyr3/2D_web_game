import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MapSchema } from './map-db/map-db.model';
import { MapDbService } from './map-db/map-db.service';
import { RequestMapTempController } from './request-map-temp.controller';
import { RequestMapTempService } from './request-map-temp.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Map', schema: MapSchema }])],
    controllers: [RequestMapTempController],
    providers: [RequestMapTempService, MapDbService],
})
export class RequestMapTempModule {}
