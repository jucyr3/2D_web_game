import { Component, QueryList, ViewChildren } from '@angular/core';
import { TileComponent } from '@app/components/edit-components/tile/tile.component';
import { DragAndDropService } from '@app/services/edit-services/drag-and-drop.service';
import { EditingToolService } from '@app/services/edit-services/editing-tool.service';
import { MapService } from '@app/services/edit-services/map.service';
import { MouseService, MouseButton } from '@app/services/edit-services/mouse.service';

@Component({
    selector: 'app-tile-grid',
    imports: [TileComponent],
    templateUrl: './tile-grid.component.html',
    styleUrls: ['./tile-grid.component.scss'],
})
export class TileGridComponent {
    @ViewChildren('tileRef') tileComponents!: QueryList<TileComponent>;

    constructor(
        private readonly mouseService: MouseService,
        protected mapService: MapService,
        private readonly dragAndDropService: DragAndDropService,
        private readonly editingToolService: EditingToolService,
    ) {}

    onContextMenu(event: MouseEvent) {
        event.preventDefault();
    }

    onMouseLeave() {
        this.dragAndDropService.setCurrentHoveredTile(-1, -1);
        this.editingToolService.resetInterpolationPoints();
    }

    onMouseUp() {
        this.editingToolService.resetInterpolationPoints();
        this.editingToolService.resetProcessedTiles();
    }

    onMouseDown(event: MouseEvent) {
        this.mouseService.isRightClick = event.button === MouseButton.Right;
    }
}
