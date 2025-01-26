import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from '@common/game';
import { Map } from '@common/map';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private readonly apiUrl = environment.serverUrl;

    constructor(private readonly http: HttpClient) {}

    getGames(): Observable<Game[]> {
        return this.http.get<Game[]>(`${this.apiUrl}/games`).pipe(
            map(response => {
                const games = Array.isArray(response) ? response : [response];
                return games.map(game => this.convertToGameObject(game));
            })
        );
    }

    updateGameVisibility(gameId: number, isVisible: boolean): Observable<Game> {
        return this.http.patch<Game>(`${this.apiUrl}/games/${gameId}/isVisible`, { isVisible })
            .pipe(map(response => this.convertToGameObject(response)));
    }

    deleteGame(gameId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/games/${gameId}`);
    }

    
    createGame(gameData: { gameName: string; gameMode: string; size: string }): Observable<Game> {
        const newGame = {
            gameName: gameData.gameName,
            map: {
                name: gameData.gameName, 
                size: gameData.size,
                isVisible: true,
                description: '',
                gameMode: gameData.gameMode,
                lastModified: new Date().toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                 })
            }
        };
    
        return this.http.post<Game>(`${this.apiUrl}/games`, newGame)
            .pipe(map(response => this.convertToGameObject(response)));
    }

    private convertToGameObject(data: any): Game {
        const map = new Map(
            data.map.name,
            data.map.size,
            data.map.isVisible,
            data.map.description,
            data.map.gameMode,
            data.map.lastModified
        );

        return new Game(data.id, data.gameName, map);
    }
}