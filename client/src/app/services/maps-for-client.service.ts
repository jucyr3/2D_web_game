import { Injectable } from '@angular/core';
import { Map } from '@common/map';
import { BehaviorSubject } from 'rxjs';
import { ClientHttpRequestsService } from './client-http-requests.service';

@Injectable({
    providedIn: 'root',
})
export class MapsForClientService {
    mapsSubject = new BehaviorSubject<Map[]>([]);
    maps$ = this.mapsSubject.asObservable();

    mapsVisibleSubject = new BehaviorSubject<Map[]>([]);
    mapsVisible$ = this.mapsVisibleSubject.asObservable();

    selectedMap: Map | null = null;
    clickedMap: Map | null = null;
    loading = false;
    error: string | null = null;

    constructor(private clientHttpRequest: ClientHttpRequestsService) {}

    loadMaps() {
        this.loading = true;
        this.error = null;
        this.clientHttpRequest.getMaps().subscribe({
            next: (maps) => {
                this.mapsSubject.next(maps);
                this.loading = false;
            },
        });
    }

    loadMapsByVisibility() {
        this.loading = true;
        this.error = null;
        this.clientHttpRequest.getAllMapsByVisibility().subscribe({
            next: (maps) => {
                this.mapsVisibleSubject.next(maps);
                this.loading = false;
            },
        });
    }

    changeSelectedMap(map: Map | null) {
        this.selectedMap = map;
    }

    changeClickedMap(map: Map | null) {
        this.clickedMap = map;
    }
}
