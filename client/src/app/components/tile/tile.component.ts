import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Input } from '@angular/core';
import { EditingToolService, EditToolType, TileType } from '@app/services/editing-tool.service';

@Component({
    selector: 'app-tile',
    imports: [NgStyle],
    templateUrl: './tile.component.html',
    styleUrl: './tile.component.scss',
})
export class TileComponent {
    @Input() isMouseDown: boolean;
    @Input() tileNumber: number;
    @Input() isRightClick: boolean;

    // TODO Add attribute for GameObject contained in tile
    
    tileType: string = 'url(../assets/grass.png)'; // TODO put the base image in constant file
    editingTool: EditToolType;
    currentTileTypeOnBrush: TileType;

    constructor(private editingToolService: EditingToolService) {}

    ngOnInit() {
        this.editingToolService.activeTool$.subscribe((tool: EditToolType) => {
            this.editingTool = tool;
        })
        this.editingToolService.currentTileTypeOnBrush$.subscribe((tileType: TileType) => {
            this.currentTileTypeOnBrush = tileType;
        })
    }

    onMouseDown(event: MouseEvent): void {
        this.handleTileBrush(event.button === 2); // `true` if right-click, `false` otherwise
    }
    
    onMouseMove(): void {
        if (this.isMouseDown) {
            this.handleTileBrush(this.isRightClick);
        }
    }
    
    private handleTileBrush(isErase: boolean): void {
        if (this.editingTool === 'tileBrush') {
            if (isErase) {
                this.eraseTile();
            } else {
                this.placeTile();
            }
        }
    }

    placeTile() {
        this.tileType = this.currentTileTypeOnBrush;

        // TODO add tile logic for saving in actual Tile Object
        let column = this.tileNumber % 20; //? magic number, scale to map size
        let row = Math.floor(this.tileNumber / 20); //? magic number, scale to map size
        console.log(row, column);
    }

    eraseTile() {
        // TODO change this to the good tiles instead of the color
        this.tileType = 'url(../assets/grass.png)';
    }
}
