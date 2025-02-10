import { Items } from '@common/ItemObject';
import { MapProperties } from '@common/map.constants';

export class ItemManager {
    itemAmounts: { [itemName: string]: number } = {};

    itemMap: { [key: string]: number } = {
        size10: MapProperties.MAP_SIZE_SMALL,
        size15: MapProperties.MAP_SIZE_MEDIUM,
        size20: MapProperties.MAP_SIZE_LARGE,
    };

    items = new Set(['attributeItem1', 'conditionItem1', 'gameplayItem1', 'attributeItem2', 'conditionItem2', 'gameplayItem2', 'randomItem']);
    requiredObjects = new Set(['spawnpoint', 'flag']);

    mapSize: number;
    gameMode: 'CTF' | 'Classic';
    itemCounter: number;
    maxItemCounter: number;

    constructor(mapSize: number, gameMode: 'CTF' | 'Classic') {
        this.gameMode = gameMode;
        this.mapSize = mapSize;
        this.setDefaultItemAmounts();
        this.maxItemCounter = this.itemMap['size' + mapSize];
        this.itemCounter = 0;
    }

    increaseItemAmount(itemName: string): void {
        this.itemAmounts[itemName]++;
        if (this.items.has(itemName)) {
            if (itemName !== 'randomItem') {
                this.itemAmounts['randomItem']++;
            }
            this.itemCounter--;
        }
    }

    decreaseItemAmount(itemName: string): void {
        if (this.itemAmounts[itemName] === 0) {
            return;
        }
        this.itemAmounts[itemName]--;
        if (this.items.has(itemName)) {
            if (itemName !== 'randomItem') {
                this.itemAmounts['randomItem']--;
            }
            this.itemCounter++;
        }
    }

    setDefaultItemAmounts(): void {
        for (const item in Items) {
            if (isNaN(Number(item))) {
                this.itemAmounts[item] = this.getDefaultItemAmount(item);
            }
        }
    }

    getDefaultItemAmount(itemName: string): number {
        const defaultItems = new Set(['attributeItem1', 'conditionItem1', 'gameplayItem1', 'attributeItem2', 'conditionItem2', 'gameplayItem2']);

        if (defaultItems.has(itemName)) return 1;

        if (['spawnpoint', 'randomItem'].includes(itemName)) {
            return this.itemMap['size' + this.mapSize];
        }

        return itemName === 'flag' && this.gameMode === 'CTF' ? 1 : 0;
    }
}
