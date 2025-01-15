import { Component, OnInit } from '@angular/core';
import { Game } from '@common/game';
import { Map } from '@common/map';
import { Tile } from '@common/tile';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
    imports: [RouterLink],
    standalone: true
})
export class AdminPageComponent implements OnInit {
    games: Game[] = [];
    selectedGame: Game | null = null;

    constructor() {}

    ngOnInit() {
        this.loadGames();
    }

    loadGames() {
        // TODO : appeler la DB pour obtenir les jeux existants
        
        // Test : Création d'une matrice de tuiles
        const createTileMatrix = (size: number): Tile[][] => {
            return Array(size).fill(null).map(() => 
                Array(size).fill(null).map(() => ({
                    type: "Grass",
                    isOccupied: false,
                    isObstacle: false
                }))
            );
        };

        const map1 = new Map("test1", 10, true, "description du jeu test1", "CTF", createTileMatrix(10), new Date(), 'assets/images/game_1_exemple.jpg');
        const map2 = new Map("test2", 20, true, "description du jeu test2", "Classic", createTileMatrix(20), new Date(), 'assets/images/game_2_exemple.jpg');
        const map3 = new Map("test3", 20, true, "description du jeu test3", "Classic", createTileMatrix(20), new Date(), 'assets/images/game_3_exemple.jpg');
        const map4 = new Map("test4", 20, true, "description du jeu test4", "Classic", createTileMatrix(20), new Date(), 'assets/images/game_4_exemple.jpg');

        this.games = [
            new Game(1, 'Jeu 1', map1),
            new Game(2, 'Jeu 2', map2),
            new Game(3, 'Jeu 3', map3),
            new Game(4, 'Jeu 4', map4)
        ];
    }

    showDescription(game: Game) {
        this.selectedGame = game;
    }

    hideDescription() {
        this.selectedGame = null;
    }

    toggleVisibility(game: Game) {
        // TODO : Appeler la DB pour mettre à jour la visibilité du jeu
        game.toggleVisibility();
    }

    deleteGame(game: Game) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
            // TODO : Appeler la DB pour supprimer le jeu
            this.games = this.games.filter(g => g.id !== game.id);
        }
    }
}