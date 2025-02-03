import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MapDbService } from './map-db/map-db.service';
import { mapSchema } from './map-db/map.schema';
import { RequestMapTempController } from './request-map-temp.controller';
import { RequestMapTempService } from './request-map-temp.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Map', schema: mapSchema }])],
    controllers: [RequestMapTempController],
    providers: [RequestMapTempService, MapDbService],
})
export class RequestMapTempModule {}
