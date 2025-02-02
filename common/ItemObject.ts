export enum Items {
    attributeItem1 = 'attributeItem1',
    conditionItem1 = 'conditionItem1',
    gameplayItem1 = 'gameplayItem1',
    attributeItem2 = 'attributeItem2',
    conditionItem2 = 'conditionItem2',
    gameplayItem2 = 'gameplayItem2',
    spawnpoint = 'spawnpoint',
    randomItem = 'randomItem',
    flag = 'flag',
}


export class ItemObject {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    use(): void {
        console.log(`${this.name} was used.`);
        //useItemManager.useItem(name);
    }
}
