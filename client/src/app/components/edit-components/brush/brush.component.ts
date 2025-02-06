import { Component, Input } from '@angular/core';
import { EditingToolService, EditToolTypes } from '@app/services/edit-services/editing-tool.service';
import { TileTypes } from '@common/tileType.constants';
import { TippyDirective } from '@ngneat/helipopper';
import { BrushTooltipComponent } from '@app/components/edit-components/brush-tooltip/brush-tooltip.component';
import { MouseService } from '@app/services/edit-services/mouse.service';

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

    changeBrushTile(tileType: TileTypes) {
        this.editingToolService.setActiveTool(EditToolTypes.TileBrush);
        this.editingToolService.setTileTypeOnBrush(tileType);
    }
}
