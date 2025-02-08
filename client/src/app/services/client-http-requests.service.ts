import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Map } from '@common/map';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, throwError } from 'rxjs';
import { MapResponse } from '@common/mapResponse';


@Injectable({
  providedIn: 'root'
})

export class ClientHttpRequestsService {

  private readonly apiUrl = environment.serverUrl;

  constructor(private readonly http: HttpClient) {}

  getMaps(): Observable<Map[]> {
      return this.http.get<Map[]>(`${this.apiUrl}/maps`).pipe(
          map(response => {
              const maps = Array.isArray(response) ? response : [response];
              return maps.map(map => map);
          })
      );
  }

  loadMapById(mapId: number): Observable<Map> {
        console.log(mapId);
        return this.http.get<Map>(`${this.apiUrl}/maps/${mapId}`).pipe(map(response => {
            return response;
        }));
    }

  saveMapToServer(map: Map): Observable<MapResponse> {
    return this.http.post<MapResponse>(`${this.apiUrl}/maps`, map)
      .pipe(
        catchError((error) => {
          console.error('Error saving map:', error);
          return throwError(() => error);
        })
      );
  }

  getAllMapsByVisibility(): Observable<Map[]> {
      return this.http.get<Map[]>(`${this.apiUrl}/maps/visibility/isVisible`).pipe(
          map(response => {
              const maps = Array.isArray(response) ? response : [response];
              return maps.map(map => map);
          })
      );
  }

  updateMapVisibility(mapId: number, isVisible: boolean): Observable<Map> {
      return this.http.patch<Map>(`${this.apiUrl}/maps/${mapId}/isVisible`, { isVisible })
          .pipe(map(response => response));
  }

  saveMapImageOnServer(mapId: number, imagepng: string): Observable<Map> {
      return this.http.patch<Map>(
          `${this.apiUrl}/maps/${mapId}/previewImage`, 
          { previewImage: imagepng } 
      ).pipe(
          map(response => response)
      );
  }

  deleteMap(mapId: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/maps/${mapId}`);
  }
}
