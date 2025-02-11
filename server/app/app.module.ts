import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatGateway } from '@app/gateways/chat/chat.gateway';
import { MapController } from './controllers/maps/map/map.controller';
import { MapService } from './services/maps/map/map.service';
import { MapVerificationService } from './services/mapVerification/mapVerification.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                uri: config.get<string>('DATABASE_CONNECTION_STRING'), // Loaded from .env
            }),
        }),
        MongooseModule.forFeature(),
    ],
    controllers: [MapController],
    providers: [ChatGateway, Logger, MapService, MapVerificationService],
})
export class AppModule {}
