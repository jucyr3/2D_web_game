import { GameObject } from './gameObject.interface';

export class ItemObject implements GameObject {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    use(): void {
        console.log(`${this.name} was used.`);
        //useItemManager.useItem(name);
    }
}
