import { Map } from '@common/map';
import { MapVerification } from '@common/mapVerification.interface';
import { TileTypes } from '@common/tileType.constants';
import { MapProperties } from '@common/map.constants';
// import { Injectable } from '@nestjs/common'

// @Injectable
export class MapVerificationService {
    // temporary storage for game names
    private gameNames: { name: string }[] = [{ name: 'test' }];

    setGameNames(gameNames: { name: string }[]): void {
        this.gameNames = gameNames;
    }

    isUniqueName(name: string): boolean {
        return this.gameNames.some((game) => game.name !== name);
    }

    isNameValid(map: Map): boolean {
        return map.name.length <= MapProperties.MAX_MAP_NAME;
    }

    isDescriptionValid(map: Map): boolean {
        return map.description.length <= MapProperties.MAX_MAP_DESCRIPTION;
    }

    isMapHalfFloor(map: Map): boolean {
        const tileMatrix = map.tileMatrix;
        let tilesCount = 0;
        const totalTiles = map.size * map.size;

        for (let i = 0; i < map.size; i++) {
            for (let j = 0; j < map.size; j++) {
                if (
                    tileMatrix[i][j].type === TileTypes.GROUND_0 ||
                    tileMatrix[i][j].type === TileTypes.GROUND_1 ||
                    tileMatrix[i][j].type === TileTypes.GROUND_2
                ) {
                    tilesCount++;
                    if (tilesCount > totalTiles / 2) {
                        return true;
                    }
                }
            }
        }
        return tilesCount > totalTiles / 2;
    }

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
        dfs(startX, startY);

        function dfs(x: number, y: number) {
            const stack = [[x, y]];
            while (stack.length > 0) {
                const popped = stack.pop();
                if (popped === undefined) {
                    return;
                }
                const [tempx, tempy] = popped;
                for (const [dirx, diry] of directions) {
                    const resx = tempx + dirx;
                    const resy = tempy + diry;
                    if (
                        resx >= 0 &&
                        resx < rows &&
                        resy >= 0 &&
                        resy < cols &&
                        !visited[resx][resy] &&
                        (tileMatrix[resx][resy].type !== TileTypes.WALL)
                    ) {
                        visited[resx][resy] = true;
                        stack.push([resx, resy]);
                    }
                }
            }
        }

        // check if all non-wall tiles are visited
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
        const tileMatrix = map.tileMatrix;
        let startCount = 0;

        for (let i = 0; i < map.size; i++){
            for (let j = 0; j < map.size; j++){
                if (tileMatrix[i][j].itemObject !== null && tileMatrix[i][j].itemObject.name === 'spawnpoint') {
                    startCount++;
                }
            }
        }

        if (map.size === MapProperties.MAP_SIZE_SMALL) {
            return startCount === MapProperties.SPAWN_COUNT_SMALL;
        } else if (map.size === MapProperties.MAP_SIZE_MEDIUM) {
            return startCount === MapProperties.SPAWN_COUNT_MEDIUM;
        } else if (map.size === MapProperties.MAP_SIZE_LARGE) {
            return startCount === MapProperties.SPAWN_COUNT_LARGE;
        } else {
            return false;
        }
    }

    areDoorsNextToWalls(map: Map): boolean {
        const tileMatrix = map.tileMatrix;
        const rows = tileMatrix.length;
        const cols = tileMatrix[0].length;

        function isGround(i: number, j: number): boolean {
            if (i < 0 || i >= rows || j < 0 || j >= cols) {
                return false;
            }
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
                    } else {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    areDoorsNotNextToBorder(map: Map): boolean {
        const tileMatrix = map.tileMatrix;
        const rows = tileMatrix.length;
        const cols = tileMatrix[0].length;

        for (let i = 0; i < rows; i++) {
            if (tileMatrix[i][0].type === TileTypes.DOOR || tileMatrix[i][cols - 1].type === TileTypes.DOOR) {
                return false;
            }
        }

        for (let j = 0; j < cols; j++) {
            if (tileMatrix[0][j].type === TileTypes.DOOR || tileMatrix[rows - 1][j].type === TileTypes.DOOR) {
                return false;
            }
        }
        return true;
    }

    validateGame(map: Map): MapVerification {
        const verification: MapVerification = {
            isUniqueName: this.isUniqueName(map.name),
            isNamePresent: !!map.name,
            isDescriptionPresent: !!map.description,
            isMapHalfFloor: this.isMapHalfFloor(map),
            isMapAccessible: this.isMapAccessible(map),
            areStartingPointsValid: this.areStartingPointsValid(map),
            areDoorsNextToWalls: this.areDoorsNextToWalls(map),
            areDoorsNotNextToBorder: this.areDoorsNotNextToBorder(map),
        };

        return verification;
    }
}
