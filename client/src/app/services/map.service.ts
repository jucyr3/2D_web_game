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


  // for testing purposes
  printMap() {
    for (let i = 0; i < this.map.size; i++) {
        for (let j = 0; j < this.map.size; j++) {
            console.log(this.map.tileMatrix[i][j].type);
        }
      } 
    }
}
