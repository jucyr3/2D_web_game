import { Game } from '@common/game';
import { Map } from '@common/map';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';

@Injectable()
export class GameService {
    private readonly logger = new Logger(GameService.name);
    private gamesFilePath = "assets/games.json";
    private games: Game[] | null = null; // Cache for games

    async getAllGames(): Promise<Game[]> {
        try {
            // Use cached games if available // html2canvas
            if (this.games) {
                return this.games;
            }

            const data = await fs.readFile(this.gamesFilePath, 'utf8');
            const gamesData = JSON.parse(data).games;
            this.games = gamesData.map(game => this.convertToGameObject(game));
            return this.games;
        } catch (error) {
            this.logger.error(`Failed to read games: ${error.message}`, error.stack);
            throw new Error(`Failed to retrieve games: ${error.message}`);
        }
    }

    async getGameById(id: number): Promise<Game> {
        try {
            const games = await this.getAllGames();
            const game = games.find(game => game.id === id);
            
            if (!game) {
                throw new NotFoundException(`Game with ID ${id} not found`);
            }
            
            return game;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to find game: ${error.message}`, error.stack);
            throw new Error(`Failed to retrieve game: ${error.message}`);
        }
    }

    async createGame(gameData: Omit<Game, 'id'>): Promise<Game> {
        try {
            const games = await this.getAllGames();
            const newId = this.generateNewId(games);
            
            const game = new Game(
                newId,
                gameData.gameName,
                gameData.map
            );

            games.push(game);
            await this.saveGames(games);
            return game;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Failed to create game: ${error.message}`, error.stack);
            throw new Error(`Failed to create game: ${error.message}`);
        }
    }

    async updateGameVisibility(id: number, isVisible: boolean): Promise<Game> {
        try {
            const games = await this.getAllGames();
            const gameIndex = games.findIndex(game => game.id === id);
            
            if (gameIndex === -1) {
                throw new NotFoundException(`Game with ID ${id} not found`);
            }

            games[gameIndex].map.isVisible = isVisible;
            await this.saveGames(games);
            return games[gameIndex];
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to update game visibility: ${error.message}`, error.stack);
            throw new Error(`Failed to update game visibility: ${error.message}`);
        }
    }

    async deleteGame(id: number): Promise<void> {
        try {
            const games = await this.getAllGames();
            const gameIndex = games.findIndex(game => game.id === id);
            
            if (gameIndex === -1) {
                throw new NotFoundException(`Game with ID ${id} not found`);
            }

            games.splice(gameIndex, 1);
            await this.saveGames(games);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to delete game: ${error.message}`, error.stack);
            throw new Error(`Failed to delete game: ${error.message}`);
        }
    }

    private async saveGames(games: Game[]): Promise<void> {
        try {
            await fs.writeFile(
                this.gamesFilePath,
                JSON.stringify({ games }, null, 2),
                'utf8'
            );

            this.games = games;
        } catch (error) {
            this.logger.error(`Failed to save games: ${error.message}`, error.stack);
            throw new Error(`Failed to save games to file: ${error.message}`);
        }
    }

    private generateNewId(games: Game[]): number {
        return games.length > 0 
            ? Math.max(...games.map(g => g.id)) + 1 
            : 1;
    }

    private convertToGameObject(data: any): Game {
        try {
            const map = new Map(
                data.map.name,
                data.map.size,
                data.map.isVisible,
                data.map.description,
                data.map.gameMode,
                data.map.lastModified
            );
            return new Game(data.id, data.gameName, map);
        } catch (error) {
            this.logger.error(`Failed to convert game data: ${error.message}`, error.stack);
            throw new Error(`Invalid game data format: ${error.message}`);
        }
    }
}