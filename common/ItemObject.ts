export class ItemObject {
    name: string;
    description: string;

    constructor(name: string, description?: string) {
        this.name = name;
        if (description) {
            this.description = description;
        } else {
            this.description = "";
        }
    }

    use(): void {
        console.log(`${this.name} was used.`);
        //useItemManager.useItem(name);
    }
}
