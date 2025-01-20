import { Injectable } from '@angular/core';
import { Map } from '@common/map';
import { TileTypes } from '@common/tileType.constants';
@Injectable({
    providedIn: 'root',
})
export class SaveService {
    private games: { name: string; description: string }[] = [];

    isUniqueName(name: string): boolean {
        return this.games.some((game) => game.name === name);
    }

    // TODO: check that 50% is land
    validateMap(map: Map): boolean {
        const flatMap = map.flattenedTileMatrix;
        const tilesCount = flatMap.filter((tile) => tile.type === (TileTypes.GROUND_0 || TileTypes.GROUND_1 || TileTypes.GROUND_2)).length;
        return tilesCount > (map.size * map.size) / 2;
    }

    validateGame(name: string, description: string): string[] {
        const error = [];
        if (!name) {
            error.push('Le nom du jeu ne peut pas etre vide.');
        } else if (this.isUniqueName(name)) {
            error.push('Le nom du jeu doit etre unique.');
        }

        if (!description) {
            error.push('La description du jeu ne peut pas etre vide.');
        }
        return error;
    }

    saveGame() {
        // a changer
        const name = 'TempName';
        const description = 'blablabla';

        const errorList = this.validateGame(name, description);
        if (errorList.length > 0) {
            errorList.forEach((error) => alert(error));
        } else {
            this.games.push({ name, description });
            alert('Le jeu a ete enregistre!');
        }
    }
}
