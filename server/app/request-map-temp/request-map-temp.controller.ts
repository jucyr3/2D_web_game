import { Map } from '@common/map';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MapDbService } from './map-db/map-db.service';
import { RequestMapTempService } from './request-map-temp.service';

@Controller('test')
export class RequestMapTempController {
    constructor(
        private readonly requestMapTempService: RequestMapTempService,
        private readonly mapService: MapDbService,
    ) {}

    @Post()
    async create(@Body('gameName') mapName: string, @Body('map') map: Map) {
        const reponse = await this.mapService.addMap(mapName, map);
        return reponse;
    }

    @Get()
    async findAll() {
        return await this.mapService.getAllMap();
    }

    @Get('visible')
    async findVisible() {
        return await this.mapService.getVisible();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.mapService.getMap(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body('gameName') mapName: string, @Body('map') map: Map) {
        return await this.mapService.changeMap(id, mapName, map);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.mapService.remove(id);
    }
}
