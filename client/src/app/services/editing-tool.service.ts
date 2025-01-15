import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type EditToolType = "tileBrush" | "hand";
export type TileType = "black" | "blue" | "white" | "red" | 'url(../assets/johnPork.png)';

@Injectable({
  providedIn: 'root'
})
export class EditingToolService {

  private activeToolSubject = new BehaviorSubject<EditToolType>("tileBrush");
  activeTool$ = this.activeToolSubject.asObservable();

  private currentTileTypeOnBrushSubject = new BehaviorSubject<TileType>('url(../assets/johnPork.png)');
  currentTileTypeOnBrush$ = this.currentTileTypeOnBrushSubject.asObservable();

  constructor() { }
}
