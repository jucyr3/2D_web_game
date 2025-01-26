import { GameService } from '@app/services/game/game/game.service';
import { Game } from '@common/game';
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
        type: Game,
        isArray: true 
    })
    async getAllGames(): Promise<Game[]> {
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
        type: Game 
    })
    async getGameById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<Game> {
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

    @Post('/')
    @ApiOperation({ summary: 'Create a new game' })
    @ApiResponse({ 
        status: HttpStatus.CREATED, 
        description: 'Game created successfully',
        type: Game 
    })
    async createGame(@Body() game: Game): Promise<Game> {
        try {
            return await this.gameService.createGame(game);
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
        type: Game 
    })
    async updateGameVisibility(
        @Param('id', ParseIntPipe) id: number,
        @Body('isVisible') isVisible: boolean
    ): Promise<Game> {
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