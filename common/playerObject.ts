import { GameObject } from './gameObject.interface';

export class PlayerObject implements GameObject {
    name: string;
    team: '1' | '2' | 'ffa';

    constructor(name: string) {
        this.name = name;
    }
}
