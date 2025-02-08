import { Component, Input } from '@angular/core';
import { injectTippyRef } from '@ngneat/helipopper';
import { tileDetails } from '@app/../assets/tiles/tile-details';
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
        return tileDetails[this.tileType].name;
    }

    get tileDescriptionText(): string {
        return tileDetails[this.tileType].description;
    }
}
