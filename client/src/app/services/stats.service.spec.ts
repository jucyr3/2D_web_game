import { TestBed } from '@angular/core/testing';

import { characterConstants } from '@app/constants/characterConstants';
import { StatsService } from './stats.service';

describe('StatsService', () => {
    let service: StatsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StatsService],
        });
        service = TestBed.inject(StatsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should increase the stat of the selected stat (life or speed)', () => {
        service.assignBonus('life');
        expect(service.getCombinedStats().life.stat).toBe(characterConstants.addedBonus);
        expect(service.getCombinedStats().speed.stat).toBe(characterConstants.defaultStatValue);
        expect(service.getCombinedStats().attack.stat).toBe(characterConstants.defaultStatValue);
        expect(service.getCombinedStats().defense.stat).toBe(characterConstants.defaultStatValue);
    });

    it('should set selected to true for the selected stat (life or speed)', () => {
        service.assignBonus('life');
        expect(service.getCombinedStats().life.selected).toBe(characterConstants.statSelected);
        expect(service.getCombinedStats().speed.selected).toBe(characterConstants.statNotSelected);

        service.assignBonus('speed');
        expect(service.getCombinedStats().life.selected).toBe(characterConstants.statNotSelected);
        expect(service.getCombinedStats().speed.selected).toBe(characterConstants.statSelected);
    });
    it('should set selected to true for the selected stat (attack or defense)', () => {
        service.assignDiceSix('attack');
        expect(service.getCombinedStats().attack.selected).toBe(characterConstants.statSelected);
        expect(service.getCombinedStats().defense.selected).toBe(characterConstants.statNotSelected);

        service.assignDiceSix('defense');
        expect(service.getCombinedStats().attack.selected).toBe(characterConstants.statNotSelected);
        expect(service.getCombinedStats().defense.selected).toBe(characterConstants.statSelected);
    });
});
