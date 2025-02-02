export class ItemManager {

    itemAmounts: { [itemName: string]: number } = {};

    itemMap: { [key: string]: number } = {
        size10: 2,
        size15: 4,
        size20: 6,
    };

    mapSize: number;

    itemTypes: string[] = ["attributeItem1", "conditionItem1", "gameplayItem1", "attributeItem2", "conditionItem2", "gameplayItem2", "spawnpoint", "randomItem", "flag"];


    constructor(mapSize: number) {
        this.mapSize = mapSize;
        this.setDefaultItemAmounts();
    }

    increaseItemAmount(itemName: string): void {
        this.itemAmounts[itemName]++;
    }

    decreaseItemAmount(itemName: string): void {
        try {
            if (this.itemAmounts[itemName] === 0) {
                throw new Error(`Item ${itemName} is already at 0.`); 
            }
            this.itemAmounts[itemName]--;
        } 
        catch (e) {
            console.error("error, item was already at 0");
        }
    }

    setDefaultItemAmounts(): void {
        for (const item of this.itemTypes) {
            this.itemAmounts[item] = this.getItemAmount(item);
        }
    }

    getItemAmount(itemName: string): number {
        switch (itemName) {
            case 'attributeItem1':
                return this.itemAmounts['attributeItem1'] = 1;

            case 'conditionItem1':
                return this.itemAmounts['conditionItem1'] = 1;

            case 'gameplayItem1':
                return this.itemAmounts['gameplayItem1'] = 1;

            case 'attributeItem2':
                return this.itemAmounts['attributeItem2'] = 1;

            case 'conditionItem2':
                return this.itemAmounts['conditionItem2'] = 1;

            case 'gameplayItem2':
                return this.itemAmounts['gameplayItem2'] = 1;

            case 'spawnpoint':
                return this.itemMap['size' + this.mapSize];

            case 'randomItem':
                return this.itemMap['size' + this.mapSize];

            case 'flag':
                return this.itemAmounts['flag'] = 1;

            default:
                // tslint:disable-next-line: no-console
                console.error(`Item ${itemName} not found`);
                return 0;
        }
    }
}