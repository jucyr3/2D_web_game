import { Injectable } from '@angular/core';
import { EDIT_TOOL_TYPES, TILE_TYPES } from './editing-tool.constants';



@Injectable({
  providedIn: 'root'
})
export class EditingToolService {
  
  // TODO set inital tile type cleaner

  private activeTool: EDIT_TOOL_TYPES = EDIT_TOOL_TYPES.HAND;
  private currentTileTypeOnBrush: TILE_TYPES = TILE_TYPES.GRASS;

  setActiveTool(tool: EDIT_TOOL_TYPES) {
    this.activeTool = tool;
  }

  getActiveTool(): EDIT_TOOL_TYPES {
    return this.activeTool;
  }
  
  setTileTypeOnBrush(tileType: TILE_TYPES) {
    this.currentTileTypeOnBrush = tileType;
  }

  getCurrentTileTypeOnBrush(): TILE_TYPES {
    return this.currentTileTypeOnBrush;
  }



  // TODO put this in another service (ex: map-display.service.ts) (no created yet)
  getTileImage(tileType: TILE_TYPES): string {
    return `url(assets/${tileType}.png)`; // Use the tileType parameter
  }

  constructor() { }
}
