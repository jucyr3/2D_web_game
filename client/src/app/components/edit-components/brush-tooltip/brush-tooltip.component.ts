import { Component, Input } from '@angular/core';
import { injectTippyRef } from '@ngneat/helipopper';
import { tileDescription } from '@app/../assets/tiles/tile-description';
import { TileTypes } from '@common/tileType.constants';
@Component({
    selector: 'app-brush-tooltip',
    templateUrl: './brush-tooltip.component.html',
    styleUrl: './brush-tooltip.component.scss',
})
export class BrushTooltipComponent {
    @Input() tileType: TileTypes;

    tippy = injectTippyRef();

    get tileNameText(): string {
        return tileDescription[this.tileType].name;
    }

    get tileDescriptionText(): string {
        return tileDescription[this.tileType].description;
    }
}
