import { Component, Input } from '@angular/core';
import { EditToolTypes } from '@app/services/editing-tool.constants';
import { EditingToolService } from '@app/services/editing-tool.service';
import { TileTypes } from '@common/tileType.constants';

@Component({
  selector: 'app-brush',
  imports: [],
  templateUrl: './brush.component.html',
  styleUrl: './brush.component.scss'
})
export class BrushComponent {

  @Input() tileType: TileTypes;
  @Input() isActive: boolean;


  constructor(private readonly editingToolService: EditingToolService) {}

  changeTool(tool: EditToolTypes) {
    this.editingToolService.setActiveTool(tool);
  }

  changeBrushTile(tileType: TileTypes) {
    this.changeTool(EditToolTypes.TileBrush);
    this.editingToolService.setTileTypeOnBrush(tileType);
  }

}
