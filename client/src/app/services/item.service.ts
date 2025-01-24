import { Injectable } from '@angular/core';
import { ItemObject } from '@common/ItemObject';
import { Subject } from 'rxjs';
import { MapService } from './map.service';

export const ITEM_CONTAINER_COORDINATES = { row: -2, column: -2 };

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

    private readonly resetTileToStartPositionSubject = new Subject<number>();

    constructor(private readonly mapService: MapService) {}

    get accessTile$() {
        return this.resetTileToStartPositionSubject.asObservable();
    }

    resetTileToStartPosition(row: number, column: number): void {
        const tileNumber = row * this.mapService.map.size + column;
        this.resetTileToStartPositionSubject.next(tileNumber);
    }

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
            case 'mushroom':
                this.itemAmounts['mushroom'] = 1;
                return new ItemObject('mushroom');
            case 'sword':
                this.itemAmounts['sword'] = 1;
                return new ItemObject('sword');
            case 'luma':
                this.itemAmounts['luma'] = 1;
                return new ItemObject('luma');
            case 'bomb':
                this.itemAmounts['bomb'] = 1;
                return new ItemObject('bomb');
            case 'potion':
                this.itemAmounts['potion'] = 1;
                return new ItemObject('potion');
            case 'cloak':
                this.itemAmounts['cloak'] = 1;
                return new ItemObject('cloak');
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
