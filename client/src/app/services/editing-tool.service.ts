import { Injectable } from '@angular/core';
import { TileTypes } from '@app/../../../common/tileType.constants';
import { EditToolTypes } from './editing-tool.constants';

@Injectable({
    providedIn: 'root',
})
export class EditingToolService {
    // TODO set inital tile type cleaner

    private activeTool: EditToolTypes = EditToolTypes.Hand;
    private currentTileTypeOnBrush: TileTypes = TileTypes.GROUND_1;

    setActiveTool(tool: EditToolTypes) {
        this.activeTool = tool;
    }

    getActiveTool(): EditToolTypes {
        return this.activeTool;
    }

    setTileTypeOnBrush(tileType: TileTypes) {
        this.currentTileTypeOnBrush = tileType;
    }

    getCurrentTileTypeOnBrush(): TileTypes {
        return this.currentTileTypeOnBrush;
    }

    // TODO put this in another service (ex: map-display.service.ts) (no created yet)
    getTileImage(tileType: TileTypes): string {
        return `url(assets/${tileType}.png)`; // Use the tileType parameter
    }
}
