import { Injectable } from '@angular/core';
import { ItemObject } from '@common/ItemObject';
import { MapService } from './map.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ItemService {

    constructor(private readonly mapService: MapService) {}
    itemAmounts: { [itemName: string]: number } = {}

    itemMap: { [key: number]: number } = {
        10: 2,
        15: 4,
        20: 6,
    };

    private readonly resetTileToStartPositionSubject = new Subject<number>();

    accessTile$ = this.resetTileToStartPositionSubject.asObservable();

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
                return new ItemObject('mushroom')
            case 'sword':
                this.itemAmounts['sword'] = 2;
                return new ItemObject('sword')
            case 'luma':
                this.itemAmounts['luma'] = 3;
                return new ItemObject('luma')
            case 'spawnpoint':
                this.itemAmounts['spawnpoint'] = this.itemMap[mapSize];
                return new ItemObject('spawnpoint');
            case 'randomItem':
                this.itemAmounts['randomItem'] = this.itemMap[mapSize];
                return new ItemObject('randomItem');
            default:
                console.error(`Item ${itemName} not found`);
                return new ItemObject('default')
        }
    }

    
}
