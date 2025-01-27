import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Map } from '@common/map';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class GameService {
    private readonly apiUrl = environment.serverUrl;

    constructor(private readonly http: HttpClient) {}

    getGames(): Observable<Map[]> {
        return this.http.get<Map[]>(`${this.apiUrl}/games`).pipe(
            map(response => {
                const maps = Array.isArray(response) ? response : [response];
                return maps.map(map => map);
            })
        );
    }

    getAllGamesByVisibility(): Observable<Map[]> {
        return this.http.get<Map[]>(`${this.apiUrl}/games/visibility/isVisible`).pipe(
            map(response => {
                const maps = Array.isArray(response) ? response : [response];
                return maps.map(map => map);
            })
        );
    }

    updateGameVisibility(gameId: number, isVisible: boolean): Observable<Map> {
        return this.http.patch<Map>(`${this.apiUrl}/games/${gameId}/isVisible`, { isVisible })
            .pipe(map(response => response));
    }

    getGameById(gameId: number): Observable<Map>{
        return this.http.get<Map>(`${this.apiUrl}/games/${gameId}`).pipe(map(response => response));
    }

    deleteGame(gameId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/games/${gameId}`);
    }


    // TODO change this return logic, no need to return the map
    loadGameById(gameId: number): Observable<Map> {
        console.log(gameId);
        return this.http.get<Map>(`${this.apiUrl}/games/${gameId}`).pipe(map(response => {
            console.log(response);
            return response;
        }));
    }
}