export interface Stat {
    stat: number;
    label: string;
    selected: boolean;
    isDiceSix?: boolean;
}

export interface CombinedStats {
    life: Stat;
    speed: Stat;
    attack: Stat;
    defense: Stat;
}