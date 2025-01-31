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
