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
        this.itemAmounts[itemName]--;
    }

    setDefaultItemAmounts(): void {
        for (const item of this.itemTypes) {
            this.itemAmounts[item] = this.getItemAmount(item);
        }
    }

    getItemAmount(itemName: string): number {
        switch (itemName) {
            case 'attributeItem1':
                return (this.itemAmounts['attributeItem1'] = 1);

            case 'conditionItem1':
                return (this.itemAmounts['conditionItem1'] = 1);

            case 'gameplayItem1':
                return (this.itemAmounts['gameplayItem1'] = 1);

            case 'attributeItem2':
                return (this.itemAmounts['attributeItem2'] = 1);

            case 'conditionItem2':
                return (this.itemAmounts['conditionItem2'] = 1);

            case 'gameplayItem2':
                return (this.itemAmounts['gameplayItem2'] = 1);

            case 'spawnpoint':
                return this.itemMap['size' + this.mapSize];

            case 'randomItem':
                return this.itemMap['size' + this.mapSize];

            case 'flag':
                return (this.itemAmounts['flag'] = this.gameMode === 'CTF' ? 1 : 0);

            default:
                return 0;
        }
    }
}
