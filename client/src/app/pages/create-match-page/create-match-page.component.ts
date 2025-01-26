import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GameService } from '@app/services/game.service';
import { Game } from '@common/game';

@Component({
    selector: 'app-create-match-page',
    templateUrl: './create-match-page.component.html',
    styleUrls: ['../admin-page/admin-page.component.scss'],
    imports: [RouterLink, CommonModule, FormsModule],
    standalone: true
})

export class CreateMatchPageComponent implements OnInit {
    games: Game[] = [];
    selectedGame: Game | null = null;
    hoveredGame: Game | null = null;
    loading = false;
    error: string | null = null;
    constructor(private gameService: GameService) {}
    
    ngOnInit() {
        this.loadGamesByVisibility();
    }

    loadGamesByVisibility() {
        this.loading = true;
        this.error = null;
        
        this.gameService.getAllGamesByVisibility().subscribe({
            next: (games) => {
                this.games = games;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading games:', error);
                this.error = 'Failed to load games';
                this.loading = false;
            }
        });
    }

    selectGame(game: Game) {
        this.selectedGame = game;
    }

    showDescription(game: Game) {
        this.hoveredGame = game;
    }

    hideDescription() {
        this.hoveredGame = null;
    }
    
}
