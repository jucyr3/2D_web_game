import { Component, Input } from '@angular/core';
import { injectTippyRef } from '@ngneat/helipopper';
import { tileDescription } from 'src/assets/tiles/tile-description';

@Component({
    selector: 'app-brush-tooltip',
    imports: [],
    templateUrl: './brush-tooltip.component.html',
    styleUrl: './brush-tooltip.component.scss',
})
export class BrushTooltipComponent {
    @Input() tileType: string;

    tippy = injectTippyRef();

    get tileName(): string {
        try {
            return tileDescription[this.tileType].name;
        } catch (e) {
            return 'unknown tile';
        }
    }

    get tileDescription(): string {
        try {
            return tileDescription[this.tileType].description;
        } catch (e) {
            return 'unknown tile so no description';
        }
    }
}
