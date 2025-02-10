import { Map } from '@common/map';
import { MapProperties } from '@common/map.constants';
import { MapVerification } from '@common/mapVerification.interface';
import { Tile } from '@common/tile';
import { TileTypes } from '@common/tileType.constants';

export class MapVerificationService {
    private gameNames: Set<string> = new Set(['test']); // TODO : REPRENDRE TOUS LES NOMS DES MAPS DANS LA DB

    setGameNames(gameNames: { name: string }[]): void {
        this.gameNames = new Set(gameNames.map((game) => game.name));
    }

    setAllMapsNames(maps: Map[]): void {
        this.gameNames = new Set(maps.map((map) => map.name));
    }

    isUniqueName(name: string): boolean {
        return !this.gameNames.has(name);
    }

    removeMapName(name: string): void {
        this.gameNames.delete(name);
    }

    isNameValid(map: Map): boolean {
        return map.name.length > 0 && map.name.length <= MapProperties.MAX_MAP_NAME;
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
        return false;
    }

    depthFirstSearch(x: number, y: number, tileMatrix: Tile[][], visited: boolean[][]) {
        const rows = tileMatrix.length;
        const cols = tileMatrix[0].length;
        const directions = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
        ];
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
                if (resx >= 0 && resx < rows && resy >= 0 && resy < cols && !visited[resx][resy] && tileMatrix[resx][resy].type !== TileTypes.WALL) {
                    visited[resx][resy] = true;
                    stack.push([resx, resy]);
                }
            }
        }
    }

    isMapAccessible(map: Map): boolean {
        const tileMatrix = map.tileMatrix;
        const rows = tileMatrix.length;
        const cols = tileMatrix[0].length;
        const visited = Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));

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
        this.depthFirstSearch(startX, startY, tileMatrix, visited);

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

        for (let i = 0; i < map.size; i++) {
            for (let j = 0; j < map.size; j++) {
                if (tileMatrix[i][j].itemObject !== null && tileMatrix[i][j].itemObject.name === 'spawnpoint') {
                    startCount++;
                }
            }
        }

        switch (map.size) {
            case MapProperties.MAP_SIZE_SMALL:
                return startCount === MapProperties.SPAWN_COUNT_SMALL;
            case MapProperties.MAP_SIZE_MEDIUM:
                return startCount === MapProperties.SPAWN_COUNT_MEDIUM;
            case MapProperties.MAP_SIZE_LARGE:
                return startCount === MapProperties.SPAWN_COUNT_LARGE;
            default:
                return false;
        }
    }

    areItemObjectsValid(map: Map): boolean {
        const tileMatrix = map.tileMatrix;
        let itemsCount = 0;

        for (let i = 0; i < map.size; i++) {
            for (let j = 0; j < map.size; j++) {
                if (
                    tileMatrix[i][j].itemObject !== null &&
                    (tileMatrix[i][j].itemObject.name === 'randomItem' ||
                        tileMatrix[i][j].itemObject.name === 'attributeItem1' ||
                        tileMatrix[i][j].itemObject.name === 'conditionItem1' ||
                        tileMatrix[i][j].itemObject.name === 'gameplayItem1' ||
                        tileMatrix[i][j].itemObject.name === 'attributeItem2' ||
                        tileMatrix[i][j].itemObject.name === 'conditionItem2' ||
                        tileMatrix[i][j].itemObject.name === 'gameplayItem2')
                ) {
                    itemsCount++;
                }
            }
        }
        switch (map.size) {
            case MapProperties.MAP_SIZE_SMALL:
                return itemsCount === MapProperties.SPAWN_COUNT_SMALL;
            case MapProperties.MAP_SIZE_MEDIUM:
                return itemsCount === MapProperties.SPAWN_COUNT_MEDIUM;
            case MapProperties.MAP_SIZE_LARGE:
                return itemsCount === MapProperties.SPAWN_COUNT_LARGE;
            default:
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
                        if (!(isGround(i - 1, j) && isGround(i + 1, j))) {
                            return false;
                        }
                    } else if (tileMatrix[i - 1][j].type === TileTypes.WALL && tileMatrix[i + 1][j].type === TileTypes.WALL) {
                        if (!(isGround(i, j - 1) && isGround(i, j + 1))) {
                            return false;
                        }
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
        const size = map.size;

        for (let i = 0; i < size; i++) {
            if (tileMatrix[i][0].type === TileTypes.DOOR || tileMatrix[i][size - 1].type === TileTypes.DOOR) {
                return false;
            }
            if (tileMatrix[0][i].type === TileTypes.DOOR || tileMatrix[size - 1][i].type === TileTypes.DOOR) {
                return false;
            }
        }
        return true;
    }

    isFlagPresent(map: Map): boolean {
        const tileMatrix = map.tileMatrix;

        if (map.gameMode === 'CTF') {
            for (let i = 0; i < map.size; i++) {
                for (let j = 0; j < map.size; j++) {
                    if (tileMatrix[i][j].itemObject?.name === 'flag') {
                        return true;
                    }
                }
            }
            return false;
        }
        return true;
    }

    validateGame(map: Map): MapVerification {
        const verification: MapVerification = {
            isUniqueName: this.isUniqueName(map.name),
            isNamePresent: this.isNameValid(map),
            isDescriptionPresent: !!map.description,
            isMapHalfFloor: this.isMapHalfFloor(map),
            isMapAccessible: this.isMapAccessible(map),
            areStartingPointsValid: this.areStartingPointsValid(map),
            areItemsValid: this.areItemObjectsValid(map),
            areDoorsNextToWalls: this.areDoorsNextToWalls(map),
            areDoorsNotNextToBorder: this.areDoorsNotNextToBorder(map),
            isNameValid: this.isNameValid(map),
            isDescriptionValid: this.isDescriptionValid(map),
            isFlagPresent: this.isFlagPresent(map),
        };

        return verification;
    }
}
