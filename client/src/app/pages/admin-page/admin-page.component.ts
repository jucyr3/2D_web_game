import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService } from '@app/services/game.service';
import { Router } from '@angular/router';
import { Map } from '@common/map';
import { MapService } from '@app/services/map.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
    imports: [CommonModule, FormsModule],
    standalone: true
})

export class AdminPageComponent implements OnInit {
    games: Map[] = [];
    selectedGame: Map | null = null;
    loading = false;
    error: string | null = null;

    isCreateModalOpen = false;
    newGameForm = {
        gameName: '',  
        gameMode: 'CLASSIQUE' as 'CLASSIQUE' | 'CAPTURE THE FLAG',
        gameSize: 'PETIT' as 'PETIT' | 'MOYENNE' | 'GRANDE'
    };

    constructor(private gameService: GameService, private router: Router, private mapService: MapService) {}

    ngOnInit() {
        this.loadGames();
    }

    loadGames() {
        this.loading = true;
        this.error = null;
        
        this.gameService.getGames().subscribe({
            next: (games) => {
                this.games = games;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading games:', error);
                this.error = 'Failed to load games. Please try again.';
                this.loading = false;
            }
        });
    }

    toggleVisibility(game: Map) {
        this.gameService.updateGameVisibility(game.id, !game.isVisible).subscribe({
            next: (updatedGame) => {
                const index = this.games.findIndex(g => g.id === game.id);
                if (index !== -1) {
                    this.games[index] = updatedGame;
                }
            },
            error: (error) => {
                console.error('Error updating game visibility:', error);
                this.error = 'Failed to update game visibility';
            }
        });
    }

    deleteGame(game: Map) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
            this.gameService.deleteGame(game.id).subscribe({
                next: () => {
                    this.games = this.games.filter(g => g.id !== game.id);
                },
                error: (error) => {
                    console.error('Error deleting game:', error);
                    this.error = 'Failed to delete game';
                }
            });
        }
    }

    showDescription(game: Map) {
        this.selectedGame = game;
    }

    hideDescription() {
        this.selectedGame = null;
    }

    clearError() {
        this.error = null;
    }

    openCreateModal() {
        this.isCreateModalOpen = true;
    }

    closeCreateModal() {
        this.isCreateModalOpen = false;
        this.newGameForm = {
            gameName: '',  // Reset the game name
            gameMode: 'CLASSIQUE',
            gameSize: 'PETIT'
        };
    }

    createGame() {
        const mapData = {
            name: this.newGameForm.gameName,
            gameMode: this.newGameForm.gameMode,
            size: this.newGameForm.gameSize === 'PETIT' ? '10' : 
                  this.newGameForm.gameSize === 'MOYENNE' ? '15' : '20'
        };

        this.mapService.createEmptyMap(mapData);
        this.router.navigate(['edit']);
    }

    editGame(map: Map) {
        console.log('Editing game:', map);
        this.gameService.loadGameById(map.id).subscribe({
            next: (map: Map) => {
              console.log('Map loaded:', map);
              this.mapService.loadMap(this.mapService.loadMapFromJSON(map));
              this.router.navigate(['edit']);
            },
            error: (err) => {
              console.error('Error loading map:', err);
            },
          });
    }
}