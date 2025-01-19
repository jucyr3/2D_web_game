import { Injectable } from '@angular/core';
import { Map } from "./../../../../common/map";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: Map;

  constructor() { 
    this.map = new Map("Untitled", 10, true, "", "Classic");
  }

}
