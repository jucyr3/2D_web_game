import { Logger, Module } from '@nestjs/common';
import { mapSchema } from './model/map-db/map.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MapController } from './controllers/maps/map/map.controller';
import { MapDbService } from './model/map-db/map-db.service';
import { MapService } from './services/maps/map/map.service';
import { MapVerificationService } from './services/mapVerification/mapVerification.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                uri: config.get<string>('DATABASE_CONNECTION_STRING'),
            }),
        }),
        MongooseModule.forFeature([{ name: 'Map', schema: mapSchema }]),
    ],
    controllers: [MapController],
    providers: [Logger, MapService, MapVerificationService, MapDbService],
})
export class AppModule {}
