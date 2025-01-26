import { Component } from '@angular/core';
import { ItemComponent } from '@app/components/edit-components/item/item.component';

@Component({
    selector: 'app-item-grid',
    imports: [ItemComponent],
    templateUrl: './item-grid.component.html',
    styleUrl: './item-grid.component.scss',
})
export class ItemGridComponent {}
