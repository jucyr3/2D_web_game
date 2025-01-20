import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SaveService {
    something: string;
    private games: { name: string; description: string }[] = [];

    // TODO: verify unique name -> check thru game list
    isUniqueName(name: string): boolean {
        return this.games.some((game) => game.name === name);
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
