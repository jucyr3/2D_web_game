import { Injectable } from '@angular/core';
import { ItemObject } from '@common/ItemObject';
import { MapService } from './map.service';

export const ITEM_CONTAINER_COORDINATES = { row: -2, column: -2 };
export const ITEM_TEXTURE_PATH = 'assets/items/';

@Injectable({
    providedIn: 'root',
})
export class ItemService {
    itemAmounts: { [itemName: string]: number } = {};

    itemMap: { [key: string]: number } = {
        size10: 2,
        size15: 4,
        size20: 6,
    };

    constructor(private readonly mapService: MapService) {}

    createItem(itemName: string): ItemObject {
        return this.getItemInfo(itemName);
    }

    increaseItemAmount(itemName: string): void {
        this.itemAmounts[itemName]++;
    }

    decreaseItemAmount(itemName: string): void {
        this.itemAmounts[itemName]--;
    }

    private getItemInfo(itemName: string): ItemObject {
        const mapSize = this.mapService.map.size;
        switch (itemName) {
            case 'attributeItem1':
                this.itemAmounts['attributeItem1'] = 1;
                return new ItemObject('attributeItem1');

            case 'conditionItem1':
                this.itemAmounts['conditionItem1'] = 1;
                return new ItemObject('conditionItem1');

            case 'gameplayItem1':5
                this.itemAmounts['gameplayItem1'] = 1;
                return new ItemObject('gameplayItem1');

            case 'attributeItem2':
                this.itemAmounts['attributeItem2'] = 1;
                return new ItemObject('attributeItem2');

            case 'conditionItem2':
                this.itemAmounts['conditionItem2'] = 1;
                return new ItemObject('conditionItem2');

            case 'gameplayItem2':
                this.itemAmounts['gameplayItem2'] = 1;
                return new ItemObject('gameplayItem2');

            case 'spawnpoint':
                this.itemAmounts['spawnpoint'] = this.itemMap['size' + mapSize];
                return new ItemObject('spawnpoint');

            case 'randomItem':
                this.itemAmounts['randomItem'] = this.itemMap['size' + mapSize];
                return new ItemObject('randomItem');

            case 'flag':
                this.itemAmounts['flag'] = 1;
                return new ItemObject('flag');

            default:
                // tslint:disable-next-line: no-console
                console.error(`Item ${itemName} not found`);
                return new ItemObject('default');
        }
    }
}
