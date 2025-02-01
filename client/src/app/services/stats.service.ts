import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StatsService {
    combinedStats = {
        life: {
            stat: 4,
            label: 'Vie',
            selected: false,
        },
        speed: {
            stat: 4,
            label: 'Rapidité',
            selected: false,
        },
        attack: {
            stat: 4,
            label: 'Attaque',
            selected: true,
            isDiceSix: true,
        },
        defense: {
            stat: 4,
            label: 'Défense',
            selected: false,
            isDiceSix: false,
        },
    };

    assignBonus(stat: 'life' | 'speed') {
        this.combinedStats.life.stat = 4;
        this.combinedStats.speed.stat = 4;
        this.combinedStats[stat].stat += 2;
        this.combinedStats.life.selected = stat === 'life';
        this.combinedStats.speed.selected = stat === 'speed';
    }

    assignDiceSix(stat: 'attack' | 'defense') {
        this.combinedStats.attack.selected = stat === 'attack';
        this.combinedStats.defense.selected = stat === 'defense';
    }

    getCombinedStats() {
        return this.combinedStats;
    }
}
