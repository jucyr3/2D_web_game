import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EDIT_TOOL_TYPES, TILE_TYPES } from '@app/services/editing-tool.constants';
import { EditingToolService } from '../../services/editing-tool.service';
import { MouseService } from '@app/services/mouse.service';

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

    constructor(private editingToolService: EditingToolService, private mouseService: MouseService) {}

    ngOnInit() {
        this.tileTexture = this.editingToolService.getTileImage(TILE_TYPES.GRASS); // Initialize here
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

    placeTile() {
        this.tileTexture = this.editingToolService.getTileImage(this.editingToolService.getCurrentTileTypeOnBrush());
        //this.tileService.saveTile(this.tileNumber, this.currentTileTypeOnBrush);

        // TODO add tile logic for saving in actual Tile Object
        // let column = this.tileNumber % 20; //? magic number, scale to map size
        // let row = Math.floor(this.tileNumber / 20); //? magic number, scale to map size
        // console.log(row, column);
    }

    eraseTile() {
        // TODO change this to the good tiles instead of the color
        this.tileType = TILE_TYPES.GRASS;
        this.tileTexture = 'url(assets/grass.png)';
    }
}
