import { Map } from '@common/map';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import { ItemObject } from '@common/ItemObject';
import { Tile } from '@common/Tile';
import { TileTypes } from '@common/tileType.constants';



interface MapJson {
    name: string;
    id: number;
    size: number;
    isVisible: boolean;
    description: string;
    gameMode: 'CTF' | 'Classic';
    tileMatrix: {
        type: string;
        isOccupied: boolean;
        isObstacle: boolean;
        gameObject?: {
            name: string;
            description: string;
        } | null;
    }[][];
    lastModified: string;
}

@Injectable()
export class GameService {
    private readonly logger = new Logger(GameService.name);
    private gamesFilePath = "assets/games.json";
    private maps: Map[] | null = null; 

    async getAllGames(): Promise<Map[]> {
        try {
            if (this.maps) {
                return this.maps;
            }
            const data = await fs.readFile(this.gamesFilePath, 'utf8');
            const gamesData = JSON.parse(data).games;
            this.maps = gamesData.map(game => this.loadMapFromJSON(game));
            return this.maps;
        } catch (error) {
            this.logger.error(`Failed to read games: ${error.message}`, error.stack);
            throw new Error(`Failed to retrieve games: ${error.message}`);
        }
    }

    async getAllGamesByVisibility(): Promise<Map[]> {
        try {
            const data = await fs.readFile(this.gamesFilePath, 'utf8');
            const gamesData = JSON.parse(data).games;
            this.maps = gamesData.map(game => this.loadMapFromJSON(game));
            return this.maps.filter(game => game.isVisible === true);
        } catch (error) {
            this.logger.error(`Failed to get games by visibility: ${error.message}`, error.stack);
            throw new Error(`Failed to retrieve games by visibility: ${error.message}`);
        }
    }

    async getGameById(id: number): Promise<Map> {
        try {
            const maps = await this.getAllGames();
            const map = maps.find(game => game.id === id);
            
            if (!map) {
                throw new NotFoundException(`Game with ID ${id} not found`);
            }
            
            return map;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to find game: ${error.message}`, error.stack);
            throw new Error(`Failed to retrieve game: ${error.message}`);
        }
    }

    async createGame(map: Map): Promise<Map> {
        try {
            map.id = this.generateRandomId();
            this.maps.push(map);
            await this.saveGames(this.maps);
            return map;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Failed to create game: ${error.message}`, error.stack);
            throw new Error(`Failed to create game: ${error.message}`);
        }
    }

    async updateGameVisibility(id: number, isVisible: boolean): Promise<Map> {
        try {
            const maps = await this.getAllGames();
            const mapIndex = maps.findIndex(game => game.id === id);
            
            if (mapIndex === -1) {
                throw new NotFoundException(`Game with ID ${id} not found`);
            }

            maps[mapIndex].isVisible = isVisible;
            await this.saveGames(maps);
            return maps[mapIndex];
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

    private async saveGames(games: Map[]): Promise<void> {
        try {
            await fs.writeFile(
                this.gamesFilePath,
                JSON.stringify({ games }, null, 2),
                'utf8'
            );

            this.maps = games;
        } catch (error) {
            this.logger.error(`Failed to save games: ${error.message}`, error.stack);
            throw new Error(`Failed to save games to file: ${error.message}`);
        }
    }

    private generateRandomId(): number {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return parseInt(`${timestamp}${random}`);
    }

    parseTileMatrix(json: MapJson): Tile[][] {
        // eslint-disable-next-line
        return json.tileMatrix.map((row) =>
            row.map((tileData) => {
                const type = tileData.type as TileTypes;
                const isOccupied = tileData.isOccupied;
                const isObstacle = tileData.isObstacle;
                // TODO: Fix this
                const gameObject = tileData.gameObject ? new ItemObject(tileData.gameObject.name, tileData.gameObject.description) : null;

                return new Tile(type, isOccupied, isObstacle, gameObject);
            }),
        );
    }

    loadMapFromJSON(json: MapJson): Map {
        const tileMatrix = this.parseTileMatrix(json);

        console.log(json.id);
        return new Map(json.name, json.id, json.size, json.isVisible, json.description, json.gameMode, tileMatrix);
    }
}