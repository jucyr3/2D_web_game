import { Injectable } from '@angular/core';
import { EDIT_TOOL_TYPES, TILE_TYPES } from './editing-tool.constants';



@Injectable({
  providedIn: 'root'
})
export class EditingToolService {
  
  // TODO set inital tile type cleaner

  private activeToolSubject: EDIT_TOOL_TYPES = EDIT_TOOL_TYPES.HAND;
  private currentTileTypeOnBrushSubject: TILE_TYPES = TILE_TYPES.GRASS;

  setActiveTool(tool: EDIT_TOOL_TYPES) {
    this.activeToolSubject = tool;
  }

  setTileTypeOnBrush(tileType: TILE_TYPES) {
    this.currentTileTypeOnBrushSubject = tileType;
  }

  getCurrentTileTypeOnBrush(): TILE_TYPES {
    return this.currentTileTypeOnBrushSubject;
  }

  getActiveTool(): EDIT_TOOL_TYPES {
    return this.activeToolSubject;
  }


  // TODO put this in another service (ex: map-display.service.ts)
  getTileImage(tileType: TILE_TYPES): string {
    return `url(assets/${tileType}.png)`; // Use the tileType parameter
  }

  constructor() { }
}
