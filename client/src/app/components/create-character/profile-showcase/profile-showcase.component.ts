import { Component } from '@angular/core';
import { NameComponent } from '@app/components/create-character/name/name.component';
import { SingleStatComponent } from '@app/components/create-character/single-stat/single-stat.component';
import { ProfileService } from '@app/services/profile.service';
import { StatsService } from '@app/services/stats.service';

@Component({
    selector: 'app-profile-showcase',
    imports: [NameComponent, SingleStatComponent],
    templateUrl: './profile-showcase.component.html',
    styleUrl: './profile-showcase.component.scss',
})
export class ProfileShowcaseComponent {
    combinedStats: any;

    constructor(
        public profileService: ProfileService,
        private statsService: StatsService,
    ) {
        this.combinedStats = this.statsService.getCombinedStats();
    }

    assignBonus(stat: 'life' | 'speed') {
        this.statsService.assignBonus(stat);
    }

    assignDiceSix(stat: 'attack' | 'defense') {
        this.statsService.assignDiceSix(stat);
    }
}
