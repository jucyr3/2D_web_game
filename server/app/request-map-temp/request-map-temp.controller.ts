import { Map } from '@common/map';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MapDbService } from './map-db/map-db.service';

@Controller('test')
export class RequestMapTempController {
    constructor(private readonly mapService: MapDbService) {}

    @Post()
    async create(@Body() map: Map) {
        const reponse = await this.mapService.addMap(map);
        return reponse;
    }

    @Get()
    async findAll() {
        return this.mapService.getAllMaps();
    }

    @Get('visible')
    async findVisible() {
        return this.mapService.getVisible();
    }
    @Get('image/:id')
    async findImage(@Param('id') id: string) {
        return this.mapService.getImage(id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.mapService.getMap(id);
    }
    @Patch(':id')
    async update(@Param('id') id: string, @Body() map: Map) {
        return this.mapService.changeMap(id, map);
    }
    @Patch(':id/img')
    async changeImg(@Param('id') id: string, @Body('previewImage') image: string) {
        return this.mapService.saveImage(id, image);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.mapService.remove(id);
    }
}
