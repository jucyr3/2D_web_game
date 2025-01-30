import { NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { TileComponent } from '@app/components/edit-components/tile/tile.component';
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditingToolService } from '@app/services/editing-tool.service';
import { MapService } from '@app/services/map.service';
import { MouseService } from '@app/services/mouse.service';

@Component({
    selector: 'app-tile-grid',
    imports: [TileComponent, NgFor],
    templateUrl: './tile-grid.component.html',
    styleUrls: ['./tile-grid.component.scss'],
})
export class TileGridComponent implements OnInit, OnDestroy {
    @ViewChildren('tileRef') tileComponents!: QueryList<TileComponent>;

    private disableContextMenuListener: () => void;

    constructor(
        private readonly mouseService: MouseService,
        protected mapService: MapService,
        private readonly renderer: Renderer2,
        private readonly dragAndDropService: DragAndDropService, // Inject Renderer2
        private readonly editingToolService: EditingToolService,
    ) {}

    ngOnInit() {
        // Use Renderer2 to listen for contextmenu events
        this.disableContextMenuListener = this.renderer.listen('document', 'contextmenu', (event: MouseEvent) => {
            event.preventDefault();
        });
    }

    ngOnDestroy() {
        // Clean up the listener using Renderer2
        if (this.disableContextMenuListener) {
            this.disableContextMenuListener();
        }
    }

    onMouseLeave() {
        this.dragAndDropService.setCurrentHoveredTile(-1, -1);
        this.editingToolService.resetInterpolationPoints();
    }

    onMouseEnter(event: MouseEvent) {
        if (event.buttons !== 0) {
            this.mouseService.isMouseDown = true;
            this.mouseService.isRightClick = event.buttons === 2;
        }
    }

    onMouseUp() {
        this.editingToolService.resetInterpolationPoints();
        this.editingToolService.resetProcessedTiles();
    }

    onMouseDown(event: MouseEvent) {
        this.mouseService.isRightClick = event.button === 2;
    }
}
