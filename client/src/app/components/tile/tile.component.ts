import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EDIT_TOOL_TYPES, TILE_TYPES } from '@app/services/editing-tool.constants';
import { EditingToolService } from '../../services/editing-tool.service';
import { MouseService } from '@app/services/mouse.service';
import { MapService } from '@app/services/map.service';

@Component({
    selector: 'app-tile',
    imports: [NgStyle],
    templateUrl: './tile.component.html',
    styleUrl: './tile.component.scss',
})
export class TileComponent {
    @Input() tileNumber: number;
    
    // TODO Add attribute for GameObject contained in tile
    
    tileTexture: string;
    tileType: TILE_TYPES;
    
    row: number;
    column: number;

    constructor(private editingToolService: EditingToolService, private mouseService: MouseService, private mapService: MapService) {}

    ngOnInit() {
        this.tileTexture = this.editingToolService.getTileImage(TILE_TYPES.GRASS); // Initialize here
        this.row = Math.floor(this.tileNumber / this.mapService.map.size); 
        this.column = this.tileNumber % this.mapService.map.size;

    }

    onMouseDown(event: MouseEvent): void {
        this.handleTileBrush(event.button === 2); // `true` if right-click, `false` otherwise
    }

    onMouseMove(): void {
        if (this.mouseService.isMouseDown) {
            this.handleTileBrush(this.mouseService.isRightClick);
        }
    }

    private handleTileBrush(isErase: boolean): void {
        if (this.editingToolService.getActiveTool() === EDIT_TOOL_TYPES.TILE_BRUSH) {
            if (isErase) {
                this.eraseTile();
            } else {
                this.placeTile();
            }
        }
    }

    //? maybe logic to much coupled with view, possible refactor
    placeTile() {
        this.tileTexture = this.editingToolService.getTileImage(this.editingToolService.getCurrentTileTypeOnBrush());
        this.mapService.map.tileMatrix[this.row][this.column].type = this.editingToolService.getCurrentTileTypeOnBrush();
    }

    eraseTile() {
        this.tileType = TILE_TYPES.GRASS;
        this.tileTexture = `url(assets/${TILE_TYPES.GRASS}.png)`;
        this.mapService.map.tileMatrix[this.row][this.column].type = TILE_TYPES.GRASS;
    }
}
