import { Injectable } from '@angular/core';
import { Map } from '@common/map';
import { TileTypes } from '@common/tileType.constants';

const TEMPNUMBER = 10;
@Injectable({
    providedIn: 'root',
})
export class SaveService {
    private games: { name: string; description: string }[] = [];

    isUniqueName(name: string): boolean {
        return this.games.some((game) => game.name === name);
    }

    isMapHalfFloor(map: Map): boolean {
        const flatMap = map.flattenedTileMatrix;
        const tilesCount = flatMap.filter((tile) => tile.type === (TileTypes.GROUND_0 || TileTypes.GROUND_1 || TileTypes.GROUND_2)).length;
        return tilesCount > (map.size * map.size) / 2;
    }

    // TODO: fix complexity
    isMapAccessible(map: Map): boolean {
        const tileMatrix = map.tileMatrix;
        const rows = tileMatrix.length;
        const cols = tileMatrix[0].length;
        const visited = Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));
        const directions = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
        ];

        // find starting point
        let startX = 0;
        let startY = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (tileMatrix[i][j].type !== TileTypes.WALL) {
                    startX = i;
                    startY = j;
                    break;
                }
            }
        }
        visited[startX][startY] = true;

        // dfs
        const stack = [[startX, startY]];
        while (stack.length > 0) {
            const [tempx, tempy] = stack.pop()!;
            for (const [dirx, diry] of directions) {
                const resx = tempx + dirx;
                const resy = tempy + diry;
                if (resx >= 0 && resx < rows && resy >= 0 && resy < cols && !visited[resx][resy] && tileMatrix[resx][resy].type !== TileTypes.WALL) {
                    visited[resx][resy] = true;
                    stack.push([resx, resy]);
                }
            }
        }

        // check if all non-wall tiles are visiteds
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (tileMatrix[i][j].type !== TileTypes.WALL && !visited[i][j]) {
                    return false;
                }
            }
        }

        return true;
    }

    areStartingPointsValid(map: Map): boolean {
        // TODO: what to do
        return false;
    }

    areDoorsValid(map: Map): boolean {
        const tileMatrix = map.tileMatrix;
        const rows = tileMatrix.length;
        const cols = tileMatrix[0].length;

        function isGround(i: number, j: number): boolean {
            return (
                tileMatrix[i][j].type === TileTypes.GROUND_0 ||
                tileMatrix[i][j].type === TileTypes.GROUND_1 ||
                tileMatrix[i][j].type === TileTypes.GROUND_2
            );
        }

        for (let i = 1; i < rows - 1; i++) {
            for (let j = 1; j < cols - 1; j++) {
                if (tileMatrix[i][j].type === TileTypes.DOOR) {
                    if (tileMatrix[i][j - 1].type === TileTypes.WALL && tileMatrix[i][j + 1].type === TileTypes.WALL) {
                        return isGround(i - 1, j) && isGround(i + 1, j);
                    }
                    if (tileMatrix[i - 1][j].type === TileTypes.WALL && tileMatrix[i + 1][j].type === TileTypes.WALL) {
                        return isGround(i, j - 1) && isGround(i, j + 1);
                    }
                }
            }
        }
        return true;
    }

    validateGame(map: Map): string[] {
        const error = [];
        if (!map.name) {
            error.push('Le nom du jeu ne peut pas etre vide.');
        } else if (this.isUniqueName(map.name)) {
            error.push('Le nom du jeu doit etre unique.');
        }

        if (!map.description) {
            error.push('La description du jeu ne peut pas etre vide.');
        }

        if (!this.isMapHalfFloor(map)) {
            error.push('Plus de 50% de la surface totale de la zone de jeu doit être occupée par des tuiles de terrain.');
        }

        if (!this.isMapAccessible(map)) {
            error.push('Aucune tuile de terrain ne doit être inaccessible à cause d’un agencement de murs.');
        }

        if (!this.areStartingPointsValid(map)) {
            error.push('Tous les points de départ ont été placés.');
        }

        if (!this.areDoorsValid(map)) {
            error.push('Chaque tuile de porte doit se trouver entre deux tuiles de mur sur un même axe.');
        }

        return error;
    }

    saveGame() {
        // a changer
        const name = 'TempName';
        const description = 'blablabla';
        const tempMap = new Map('TempName', TEMPNUMBER, true, 'blablabla', 'Classic');

        const errorList = this.validateGame(tempMap);
        if (errorList.length > 0) {
            errorList.forEach((error) => alert(error));
        } else {
            this.games.push({ name, description });
            alert('Le jeu a ete enregistre!');
        }
    }
}
