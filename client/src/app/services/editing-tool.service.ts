import { Injectable } from '@angular/core';
import { EDIT_TOOL_TYPES } from './editing-tool.constants';
import { TileTypes } from '@app/../../../common/tileType.constants';

@Injectable({
    providedIn: 'root',
})
export class EditingToolService {
    // TODO set inital tile type cleaner

    private activeTool: EDIT_TOOL_TYPES = EDIT_TOOL_TYPES.HAND;
    private currentTileTypeOnBrush: TileTypes = TileTypes.GROUND_1;

    setActiveTool(tool: EDIT_TOOL_TYPES) {
        this.activeTool = tool;
    }

    getActiveTool(): EDIT_TOOL_TYPES {
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

    constructor() {}
}
