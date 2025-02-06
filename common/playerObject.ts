export class PlayerObject {
    name: string;
    team: '1' | '2' | 'ffa';

    constructor(name: string) {
        this.name = name;
    }
}
