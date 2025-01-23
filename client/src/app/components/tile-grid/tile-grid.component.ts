import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { TileComponent } from '@app/components/tile/tile.component';
import { NgFor } from '@angular/common';
import { MouseService } from '@app/services/mouse.service';
import { MapService } from '@app/services/map.service';

@Component({
    selector: 'app-tile-grid',
    imports: [TileComponent, NgFor],
    templateUrl: './tile-grid.component.html',
    styleUrls: ['./tile-grid.component.scss'],
})
export class TileGridComponent implements OnInit, OnDestroy {
    private disableContextMenuListener: () => void;

    constructor(
        private readonly mouseService: MouseService,
        protected mapService: MapService,
        private readonly renderer: Renderer2, // Inject Renderer2
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
        this.mouseService.isMouseDown = false;
    }

    onMouseEnter(event: MouseEvent) {
        if (event.buttons !== 0) {
            this.mouseService.isMouseDown = true;
            this.mouseService.isRightClick = event.buttons === 2;
        }
    }
}
