import { Component, Input } from '@angular/core';
import { ItemObject } from '@common/ItemObject';
import { injectTippyRef } from '@ngneat/helipopper';
import { itemDescriptions } from 'src/assets/items/item-descriptions';

@Component({
    selector: 'app-item-tooltip',
    templateUrl: './item-tooltip.component.html',
    styleUrls: ['./item-tooltip.component.scss'],
})
export class ItemTooltipComponent {
    @Input() itemObject: ItemObject | null;

    tippy = injectTippyRef();

    get itemDescription(): string {
        if (!this.itemObject) return '';
        return itemDescriptions[this.itemObject.name].description;
    }

    get itemName(): string {
        if (!this.itemObject) return '';
        return itemDescriptions[this.itemObject.name].name;
    }
}
