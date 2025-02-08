import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Course, courseSchema } from '@app/model/database/course';
import { CourseController } from '@app/controllers/course/course.controller';
import { CourseService } from '@app/services/course/course.service';
import { DateController } from '@app/controllers/date/date.controller';
import { DateService } from '@app/services/date/date.service';
import { ChatGateway } from '@app/gateways/chat/chat.gateway';
import { ExampleService } from '@app/services/example/example.service';
import { ExampleController } from '@app/controllers/example/example.controller';
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
        MongooseModule.forFeature([{ name: Course.name, schema: courseSchema }]),
    ],
    controllers: [CourseController, DateController, ExampleController, MapController],
    providers: [ChatGateway, CourseService, DateService, ExampleService, Logger, MapService, MapVerificationService],
})
export class AppModule {}
