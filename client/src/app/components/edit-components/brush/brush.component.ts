import { Component, Input } from '@angular/core';
import { EditToolTypes } from '@app/services/editing-tool.constants';
import { EditingToolService } from '@app/services/editing-tool.service';
import { TileTypes } from '@common/tileType.constants';
import { TippyDirective } from '@ngneat/helipopper';
import { BrushTooltipComponent } from '@app/components/edit-components/brush-tooltip/brush-tooltip.component';
import { MouseService } from '@app/services/mouse.service';

@Component({
    selector: 'app-brush',
    imports: [BrushTooltipComponent, TippyDirective],
    templateUrl: './brush.component.html',
    styleUrl: './brush.component.scss',
})
export class BrushComponent {
    @Input() tileType: TileTypes;
    @Input() isActive: boolean;

    constructor(
        private readonly editingToolService: EditingToolService,
        private readonly mouseService: MouseService,
    ) {}

    get isTooltipEnabled() {
        return !this.mouseService.isMouseDown;
    }

    changeTool(tool: EditToolTypes) {
        this.editingToolService.setActiveTool(tool);
    }

    changeBrushTile(tileType: TileTypes) {
        this.changeTool(EditToolTypes.TileBrush);
        this.editingToolService.setTileTypeOnBrush(tileType);
    }
}
