import { Component } from '@angular/core';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
    imports: [SidebarComponent, PlayAreaComponent],
})
export class GamePageComponent {
    games: { name: string; description: string }[] = [];

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
