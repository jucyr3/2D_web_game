import { Component, OnInit, OnDestroy, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { TileComponent } from '@app/components/tile/tile.component';
import { NgFor } from '@angular/common';
import { MouseService } from '@app/services/mouse.service';
import { MapService } from '@app/services/map.service';
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { ItemService } from '@app/services/item.service';

@Component({
    selector: 'app-tile-grid',
    imports: [TileComponent, NgFor],
    templateUrl: './tile-grid.component.html',
    styleUrls: ['./tile-grid.component.scss'],
})
export class TileGridComponent implements OnInit, OnDestroy {
    private disableContextMenuListener: () => void;

    @ViewChildren('tileRef') tileComponents!: QueryList<TileComponent>;

    constructor(
        private readonly mouseService: MouseService,
        protected mapService: MapService,
        private readonly renderer: Renderer2,
        private readonly dragAndDropService: DragAndDropService, // Inject Renderer2
        private readonly itemService: ItemService
    ) {}

    ngOnInit() {
        // Use Renderer2 to listen for contextmenu events
        this.disableContextMenuListener = this.renderer.listen('document', 'contextmenu', (event: MouseEvent) => {
            event.preventDefault();
        });
        this.itemService.accessTile$.subscribe((tileNumber) => {
            this.resetTileToStartPosition(tileNumber); // Call the accessTile function
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
        this.dragAndDropService.setCurrentHoveredTile(-1, -1);
    }

    onMouseEnter(event: MouseEvent) {
        if (event.buttons !== 0) {
            this.mouseService.isMouseDown = true;
            this.mouseService.isRightClick = event.buttons === 2;
        }
    }

    resetTileToStartPosition(tileNumber: number): void {
        // Find the tile with the specified tileNumber
        
        const tileComponent = this.tileComponents.find(tile => tile.tileNumber === tileNumber);

        if (tileComponent) {
            // Call a function on the tile component
            tileComponent.onMouseUp(); // Example: Call the placeTile function
        } else {
            console.error('Tile not found with tileNumber:', tileNumber);
        }
    }
}
