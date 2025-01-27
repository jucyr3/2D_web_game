import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '@app/services/game.service';
import {Map} from '@common/map';

@Component({
    selector: 'app-create-match-page',
    templateUrl: './create-match-page.component.html',
    styleUrls: ['../admin-page/admin-page.component.scss'],
    imports: [CommonModule, FormsModule],
    standalone: true
})

export class CreateMatchPageComponent implements OnInit {
    maps: Map[] = [];
    selectedMap: Map | null = null;
    hoveredMap: Map | null = null;
    loading = false;
    error: string | null = null;
    constructor(private gameService: GameService, private router: Router) {}
    
    ngOnInit() {
        this.loadGamesByVisibility();
    }

    loadGamesByVisibility() {
        this.loading = true;
        this.error = null;
        
        this.gameService.getAllGamesByVisibility().subscribe({
            next: (maps) => {
                this.maps = maps;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading games:', error);
                this.error = 'Failed to load games';
                this.loading = false;
            }
        });
    }

    async createGame() {
        if (!this.selectedMap) return;
        
        const element = document.querySelector('.preview-container');
        if (!element) return;
    
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const image = element.querySelector('img');
            
            if (image && ctx) {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');
                localStorage.setItem('selectedGameImage', dataUrl);
                localStorage.setItem('selectedGameId', this.selectedMap.id.toString());
            }
            
            this.router.navigate(['/character']);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    selectGame(game: Map) {
        this.selectedMap = game;
        console.log("selected game :",this.selectedMap.name)
    }

    showDescription(game: Map) {
        this.hoveredMap = game;
    }

    hideDescription() {
        this.hoveredMap = null;
    }

}
