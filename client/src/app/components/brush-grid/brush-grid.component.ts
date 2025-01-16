import { Component } from '@angular/core';
import { EditingToolService } from '../../services/editing-tool.service';
import {  EDIT_TOOL_TYPES, TILE_TYPES } from '@app/services/editing-tool.constants';

@Component({
  selector: 'app-brush-grid',
  imports: [],
  templateUrl: './brush-grid.component.html',
  styleUrl: './brush-grid.component.scss'
})
export class BrushGridComponent {
  EDIT_TOOL_TYPES = EDIT_TOOL_TYPES; //? dw about it, its needed
  TILE_TYPES = TILE_TYPES;           //? dw about it, its needed


  constructor(private editingToolService: EditingToolService) { }


  changeTool(tool: EDIT_TOOL_TYPES) {
    this.editingToolService.setActiveTool(tool);
  }

  changeBrushTile(tileType: TILE_TYPES) {
    this.changeTool(EDIT_TOOL_TYPES.TILE_BRUSH);
    this.editingToolService.setTileTypeOnBrush(tileType);
  }
}
