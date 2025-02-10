import { Items } from '@common/ItemObject';
import { MapProperties } from '@common/map.constants';

export class ItemManager {
    itemAmounts: { [itemName: string]: number } = {};

    itemMap: { [key: string]: number } = {
        size10: MapProperties.SPAWN_COUNT_SMALL,
        size15: MapProperties.SPAWN_COUNT_MEDIUM,
        size20: MapProperties.SPAWN_COUNT_LARGE,
    };

    mapSize: number;
    gameMode: 'CTF' | 'Classic';

    constructor(mapSize: number, gameMode: 'CTF' | 'Classic') {
        this.gameMode = gameMode;
        this.mapSize = mapSize;
        this.setDefaultItemAmounts();
    }

    increaseItemAmount(itemName: string): void {
        this.itemAmounts[itemName]++;
    }

    decreaseItemAmount(itemName: string): void {
        if (this.itemAmounts[itemName] === 0) {
            return;
        }
        this.itemAmounts[itemName]--;
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
