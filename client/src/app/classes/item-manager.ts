export class ItemManager {
    itemAmounts: { [itemName: string]: number } = {};

    itemMap: { [key: string]: number } = {
        size10: 2,
        size15: 4,
        size20: 6,
    };

    mapSize: number;
    gameMode: 'CTF' | 'Classic';

    itemTypes: string[] = [
        'attributeItem1',
        'conditionItem1',
        'gameplayItem1',
        'attributeItem2',
        'conditionItem2',
        'gameplayItem2',
        'spawnpoint',
        'randomItem',
        'flag',
    ];

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
        for (const item of this.itemTypes) {
            this.itemAmounts[item] = this.getDefaultItemAmount(item);
        }
    }

    getDefaultItemAmount(itemName: string): number {
        switch (itemName) {
            case 'attributeItem1':
                return 1;

            case 'conditionItem1':
                return 1;

            case 'gameplayItem1':
                return 1;

            case 'attributeItem2':
                return 1;

            case 'conditionItem2':
                return 1;

            case 'gameplayItem2':
                return 1;

            case 'spawnpoint':
                return this.itemMap['size' + this.mapSize];

            case 'randomItem':
                return this.itemMap['size' + this.mapSize];

            case 'flag':
                return this.gameMode === 'CTF' ? 1 : 0;

            default:
                return 0;
        }
    }
}
