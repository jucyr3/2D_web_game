import { GameService } from '@app/services/game/game/game.service';
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

@ApiTags('Games')
@Controller('games')
export class GameController {
    private readonly logger = new Logger(GameController.name);

    constructor(private readonly gameService: GameService) {}

    @Get('/')
    @ApiOperation({ summary: 'Get all games' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Returns all games',
        type: Map,
        isArray: true 
    })
    async getAllGames(): Promise<Map[]> {
        try {
            return await this.gameService.getAllGames();
        } catch (error) {
            this.logger.error(`Failed to get all games: ${error.message}`);
            throw error;
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get game by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Returns the game',
        type: Map
    })
    async getGameById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<Map> {
        try {
            const game = await this.gameService.getGameById(id);
            if (!game) {
                throw new NotFoundException(`Game with ID ${id} not found`);
            }
            return game;
        } catch (error) {
            this.logger.error(`Failed to get game ${id}: ${error.message}`);
            throw error;
        }
    }

    @Get('/visibility/isVisible')
    @ApiOperation({ summary: 'Get games by visibility status' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Returns games filtered by visibility',
        type: Map,
        isArray: true 
    })
    async getGamesByVisibility(): Promise<Map[]> {
        try {
            return await this.gameService.getAllGamesByVisibility();
        } catch (error) {
            this.logger.error(`Failed to get games by visibility : ${error.message}`);
            throw error;
        }
    }

    @Post('/')
    @ApiOperation({ summary: 'Create a new game' })
    @ApiResponse({ 
        status: HttpStatus.CREATED, 
        description: 'Game created successfully',
        type: Map 
    })
    async createGame(@Body() map: Map): Promise<Map> {
        try {
            return await this.gameService.createGame(map);
        } catch (error) {
            this.logger.error(`Failed to create game: ${error.message}`);
            throw error;
        }
    }

    @Patch(':id/isVisible')
    @ApiOperation({ summary: 'Update game visibility' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Game visibility updated',
        type: Map 
    })
    async updateGameVisibility(
        @Param('id', ParseIntPipe) id: number,
        @Body('isVisible') isVisible: boolean
    ): Promise<Map> {
        try {
            const game = await this.gameService.updateGameVisibility(id, isVisible);
            if (!game) {
                throw new NotFoundException(`Game with ID ${id} not found`);
            }
            return game;
        } catch (error) {
            this.logger.error(`Failed to update game ${id} visibility: ${error.message}`);
            throw error;
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a game' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ 
        status: HttpStatus.NO_CONTENT, 
        description: 'Game deleted successfully' 
    })
    async deleteGame(
        @Param('id', ParseIntPipe) id: number
    ): Promise<void> {
        try {
            await this.gameService.deleteGame(id);
        } catch (error) {
            this.logger.error(`Failed to delete game ${id}: ${error.message}`);
            throw error;
        }
    }
}