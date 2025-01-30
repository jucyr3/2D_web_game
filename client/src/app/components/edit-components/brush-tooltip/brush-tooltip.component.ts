import { Component, Input } from '@angular/core';
import { injectTippyRef } from '@ngneat/helipopper';
import { tileDescription } from '@app/../assets/tile-description';

@Component({
  selector: 'app-brush-tooltip',
  imports: [],
  templateUrl: './brush-tooltip.component.html',
  styleUrl: './brush-tooltip.component.scss'
})
export class BrushTooltipComponent {
  @Input() tileType: string;

  tippy = injectTippyRef();

  get tileName(): string {
    return tileDescription[this.tileType].name;
  }

  get tileDescription(): string {
    return tileDescription[this.tileType].description;
  }


}
