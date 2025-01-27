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
                return new ItemObject(
                    'mushroom',
                    'A small, red mushroom with white spots. Consuming it grants the player extra health, making it a valuable resource for survival.',
                );

            case 'sword':
                this.itemAmounts['sword'] = 1;
                return new ItemObject(
                    'sword',
                    'A sharp, gleaming sword forged from rare metals. It is the perfect weapon for close combat, allowing the player to defeat enemies with ease.',
                );

            case 'luma':
                this.itemAmounts['luma'] = 1;
                return new ItemObject(
                    'luma',
                    'A glowing, celestial orb that radiates energy. It is said to hold mysterious powers, though its true purpose remains unknown.',
                );

            case 'bomb':
                this.itemAmounts['bomb'] = 1;
                return new ItemObject(
                    'bomb',
                    'A volatile explosive device. Use it wisely to clear obstacles or defeat groups of enemies, but be careful not to get caught in the blast!',
                );

            case 'potion':
                this.itemAmounts['potion'] = 1;
                return new ItemObject(
                    'potion',
                    "A magical elixir in a shimmering vial. Drinking it restores the player's health, making it essential for long journeys and tough battles.",
                );

            case 'cloak':
                this.itemAmounts['cloak'] = 1;
                return new ItemObject(
                    'cloak',
                    'A mystical cloak that grants the wearer the ability to become invisible for a short time. Perfect for sneaking past enemies or escaping danger.',
                );

            case 'spawnpoint':
                this.itemAmounts['spawnpoint'] = this.itemMap['size' + mapSize];
                return new ItemObject('spawnpoint', "A magical marker that sets the player's respawn location.");

            case 'randomItem':
                this.itemAmounts['randomItem'] = this.itemMap['size' + mapSize];
                return new ItemObject('randomItem', 'Becomes a random item upon starting the game.');

            case 'flag':
                this.itemAmounts['flag'] = 1;
                return new ItemObject('flag', 'A brightly colored flag.');

            default:
                // tslint:disable-next-line: no-console
                console.error(`Item ${itemName} not found`);
                return new ItemObject('default', 'An unknown item. Its purpose and abilities are a mystery.');
        }
    }
}
