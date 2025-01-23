import { Component } from '@angular/core';
import { EditToolTypes } from '@app/services/editing-tool.constants';
import { EditingToolService } from '@app/services/editing-tool.service';
import { TileTypes } from '@common/tileType.constants';

@Component({
    selector: 'app-brush-grid',
    imports: [],
    templateUrl: './brush-grid.component.html',
    styleUrl: './brush-grid.component.scss',
})
export class BrushGridComponent {
    editToolTypes = EditToolTypes; // ? dw about it, its needed
    tileTypes = TileTypes; // ? dw about it, its needed

    constructor(private readonly editingToolService: EditingToolService) {}

    changeTool(tool: EditToolTypes) {
        this.editingToolService.setActiveTool(tool);
    }

    changeBrushTile(tileType: TileTypes) {
        this.changeTool(EditToolTypes.TileBrush);
        this.editingToolService.setTileTypeOnBrush(tileType);
    }
}
