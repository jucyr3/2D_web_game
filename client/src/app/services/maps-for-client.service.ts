import { Injectable } from '@angular/core';
import { Map } from '@common/map';
import { BehaviorSubject } from 'rxjs';
import { ClientHttpRequestsService } from './client-http-requests.service';

@Injectable({
  providedIn: 'root'
})
export class MapsForClientService  {
  private mapsSubject = new BehaviorSubject<Map[]>([]);
  maps$ = this.mapsSubject.asObservable();
  
  selectedMap: Map | null = null;
  clickedMap: Map | null = null;
  loading = false;
  error: string | null = null;

  constructor(private clientHttpRequest: ClientHttpRequestsService) {}

  loadMaps() { // from server to client (for AdminPage)
    this.loading = true;
    this.error = null;
    this.clientHttpRequest.getMaps().subscribe({
        next: (maps) => {
            this.mapsSubject.next(maps);
            this.loading = false;
        },
        error: (error) => {
            console.error('Error loading games:', error);
            this.error = 'Failed to load games. Please try again.';
            this.loading = false;
        }
    });
  }

  loadMapsByVisibility() { // from server to client (for create-match page)
    this.loading = true;
    this.error = null;
    
    this.clientHttpRequest.getAllMapsByVisibility().subscribe({
        next: (maps) => {
            this.mapsSubject.next(maps);
            this.loading = false;
        },
        error: (error) => {
            console.error('Error loading games:', error);
            this.error = 'Failed to load games';
            this.loading = false;
        }
    });
  }

  changeSelectedMap(map: Map | null) {
    this.selectedMap = map;
  }

  changeClickedMap(map: Map | null){
    this.clickedMap = map;
  }
}