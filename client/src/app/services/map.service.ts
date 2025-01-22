import { Injectable } from '@angular/core';
import { Map } from "./../../../../common/map";
import { TileTypes } from '@common/tileType.constants';
import { GameObject } from '@common/gameObject.interface';

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
          if (this.map.tileMatrix[i][j].gameObject != null) {
            console.log(this.map.tileMatrix[i][j].type + " contains: " + this.map.tileMatrix[i][j].gameObject?.name);
          } else {
            console.log(this.map.tileMatrix[i][j].type);
          }
        }
      } 
    }

    changeTileType(row: number, column: number, newType: TileTypes): void {
      this.map.tileMatrix[row][column].type = newType;
    }

    setDefaultTileType(row: number, column: number): void {
      this.map.tileMatrix[row][column].type = TileTypes.GROUND_1;
    }

    getTileType(row: number, column: number): TileTypes {
      return this.map.tileMatrix[row][column].type;
    }

    placeGameObject(row: number, column: number, gameObject:GameObject): void { 
      this.map.tileMatrix[row][column].gameObject = gameObject;
      console.log("item placed in map");
    }

    moveGameObject(row: number, column: number, newRow: number, newColumn: number): void {
      this.map.tileMatrix[newRow][newColumn].gameObject = this.map.tileMatrix[row][column].gameObject;
      this.map.tileMatrix[row][column].gameObject = null;
    }

    removeGameObject(row: number, column: number): void {
      this.map.tileMatrix[row][column].gameObject = null;
    }
}
