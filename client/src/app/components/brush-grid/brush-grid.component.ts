import { Component } from '@angular/core';
import { EDIT_TOOL_TYPES } from '@app/services/editing-tool.constants';
import { EditingToolService } from '../../services/editing-tool.service';
import { TileTypes } from '@app/../../../common/tileType.constants';

@Component({
    selector: 'app-brush-grid',
    imports: [],
    templateUrl: './brush-grid.component.html',
    styleUrl: './brush-grid.component.scss',
})
export class BrushGridComponent {
    EDIT_TOOL_TYPES = EDIT_TOOL_TYPES; //? dw about it, its needed
    TileTypes = TileTypes; //? dw about it, its needed

    constructor(private readonly editingToolService: EditingToolService) {}

    changeTool(tool: EDIT_TOOL_TYPES) {
        this.editingToolService.setActiveTool(tool);
    }

    changeBrushTile(tileType: TileTypes) {
        this.changeTool(EDIT_TOOL_TYPES.TILE_BRUSH);
        this.editingToolService.setTileTypeOnBrush(tileType);
    }
}
