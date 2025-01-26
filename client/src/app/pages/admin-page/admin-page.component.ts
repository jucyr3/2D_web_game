import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GameService } from '@app/services/game.service';
import { Game } from '@common/game';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
    imports: [RouterLink, CommonModule, FormsModule],
    standalone: true
})
export class AdminPageComponent implements OnInit {
    games: Game[] = [];
    selectedGame: Game | null = null;
    loading = false;
    error: string | null = null;

    isCreateModalOpen = false;
    newGameForm = {
        gameName: '',  
        gameMode: 'CLASSIQUE' as 'CLASSIQUE' | 'CAPTURE THE FLAG',
        gameSize: 'PETIT' as 'PETIT' | 'MOYENNE' | 'GRANDE'
    };

    constructor(private gameService: GameService) {}

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

    toggleVisibility(game: Game) {
        this.gameService.updateGameVisibility(game.id, !game.map.isVisible).subscribe({
            next: (updatedGame) => {
                const index = this.games.findIndex(g => g.id === game.id);
                if (index !== -1) {
                    this.games[index] = updatedGame;
                }
            },
            error: (error) => {
                console.error('Error updating game visibility:', error);
                // Revert the visibility change in UI
                game.toggleVisibility();
                this.error = 'Failed to update game visibility';
            }
        });
    }

    deleteGame(game: Game) {
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

    // new methods
    showDescription(game: Game) {
        this.selectedGame = game;
    }

    hideDescription() {
        this.selectedGame = null;
    }

    clearError() {
        this.error = null;
    }

    // New methods for create game modal
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
        const gameData = {
            gameName: this.newGameForm.gameName,
            gameMode: this.newGameForm.gameMode,
            size: this.newGameForm.gameSize === 'PETIT' ? '10' : 
                  this.newGameForm.gameSize === 'MOYENNE' ? '15' : '20'
        };
    
        this.gameService.createGame(gameData).subscribe({
            next: (createdGame) => {
                this.games.push(createdGame);
                this.closeCreateModal();
            },
            error: (error) => {
                console.error('Error creating game:', error);
                this.error = 'Failed to create game';
            }
        });
    }
    
}