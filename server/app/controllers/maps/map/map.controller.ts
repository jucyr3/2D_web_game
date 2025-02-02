import { MapService } from '@app/services/maps/map/map.service';
import { Map } from '@common/map';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Maps')
@Controller('maps')
export class MapController {
    private readonly logger = new Logger(MapController.name);
    
        constructor(private readonly mapService: MapService) {}
    
        @Get('/')
        @ApiOperation({ summary: 'Get all maps' })
        @ApiResponse({ 
            status: HttpStatus.OK, 
            description: 'Returns all maps',
            type: Map,
            isArray: true 
        })
        async getAllMaps(): Promise<Map[]> {
            try {
                return await this.mapService.getAllMaps();
            } catch (error) {
                this.logger.error(`Failed to get all maps: ${error.message}`);
                throw error;
            }
        }
    
        @Get(':id') // TODO : TEST THIS THING
        @ApiOperation({ summary: 'Get map by ID' })
        @ApiParam({ name: 'id', type: Number })
        @ApiResponse({ 
            status: HttpStatus.OK, 
            description: 'Returns the map',
            type: Map
        })
        async getMapById(
            @Param('id', ParseIntPipe) id: number
        ): Promise<Map> {
            try {
                const map = await this.mapService.getMapById(id);
                if (!map) {
                    throw new NotFoundException(`Map with ID ${id} not found`);
                }
                return map;
            } catch (error) {
                this.logger.error(`Failed to get map ${id}: ${error.message}`);
                throw error;
            }
        }

        
        @Get('/visibility/isVisible')
        @ApiOperation({ summary: 'Get maps by visibility status' })
        @ApiResponse({ 
            status: HttpStatus.OK, 
            description: 'Returns maps filtered by visibility',
            type: Map,
            isArray: true 
        })
        async getMapsByVisibility(): Promise<Map[]> {
            try {
                return await this.mapService.getAllMapsByVisibility();
            } catch (error) {
                this.logger.error(`Failed to get maps by visibility : ${error.message}`);
                throw error;
            }
        }
    
        @Post('/')
        @ApiOperation({ summary: 'Create a new map' })
        @ApiResponse({ 
            status: HttpStatus.CREATED, 
            description: 'Map created successfully',
            type: Map 
        })
        async saveMap(@Body() map: Map): Promise<Map> { 
            try {
                return await this.mapService.saveMap(map);
            } catch (error) {
                this.logger.error(`Failed to create map: ${error.message}`);
                throw error;
            }
        }
    
        @Patch(':id/isVisible')
        @ApiOperation({ summary: 'Update map visibility' })
        @ApiParam({ name: 'id', type: Number })
        @ApiResponse({ 
            status: HttpStatus.OK, 
            description: 'Map visibility updated',
            type: Map 
        })
        async updateMapVisibility(
            @Param('id', ParseIntPipe) id: number,
            @Body('isVisible') isVisible: boolean
        ): Promise<Map> {
            try {
                const map = await this.mapService.updateMapVisibility(id, isVisible);
                if (!map) {
                    throw new NotFoundException(`Map with ID ${id} not found`);
                }
                return map;
            } catch (error) {
                this.logger.error(`Failed to update map ${id} visibility: ${error.message}`);
                throw error;
            }
        }
    
        @Patch(':id/previewImage') // TODO : change preview image of map on server
        @ApiOperation({ summary: 'Update map image' })
        @ApiParam({ name: 'id', type: Number })
        @ApiResponse({ 
            status: HttpStatus.OK, 
            description: 'Map image updated',
            type: Map 
        })
        async updatePreviewImage(
            @Param('id', ParseIntPipe) id: number,
            @Body('previewImage') previewImage: string
        ): Promise<Map> {
            try {
                const map = await this.mapService.updateMapImage(id, previewImage);
                if (!map) {
                    throw new NotFoundException(`Map with ID ${id} not found`);
                }
                return map;
            } catch (error) {
                this.logger.error(`Failed to update map ${id} image: ${error.message}`);
                throw error;
            }
        }
    
        @Delete(':id')
        @HttpCode(HttpStatus.NO_CONTENT)
        @ApiOperation({ summary: 'Delete a map' })
        @ApiParam({ name: 'id', type: Number })
        @ApiResponse({ 
            status: HttpStatus.NO_CONTENT, 
            description: 'map deleted successfully' 
        })
        async deleteMap(
            @Param('id', ParseIntPipe) id: number
        ): Promise<void> {
            try {
                await this.mapService.deleteMap(id);
            } catch (error) {
                this.logger.error(`Failed to delete map ${id}: ${error.message}`);
                throw error;
            }
        }
}
