import { Component } from '@angular/core';
import { ItemComponent } from '../item/item.component';

@Component({
    selector: 'app-item-grid',
    imports: [ItemComponent],
    templateUrl: './item-grid.component.html',
    styleUrl: './item-grid.component.scss',
})
export class ItemGridComponent {
    constructor() {}

    onClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const type = target.getAttribute('data-itemType');
        console.log('Type: ', type);
        //mouse payload = type
        //Display item image under cursor while it is in the payload
    }
}
