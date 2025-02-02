import { TestBed } from '@angular/core/testing';

import { StatsService } from './stats.service';

describe('StatsService', () => {
    let service: StatsService;

    const INITIAL_STAT_VALUE = 4;
    const INCREASED_STAT_VALUE = 6;
    const STAT_SELECTED = true;
    const STAT_NOT_SELECTED = false;

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
        expect(service.getCombinedStats().life.stat).toBe(INCREASED_STAT_VALUE);
        expect(service.getCombinedStats().speed.stat).toBe(INITIAL_STAT_VALUE);
        expect(service.getCombinedStats().attack.stat).toBe(INITIAL_STAT_VALUE);
        expect(service.getCombinedStats().defense.stat).toBe(INITIAL_STAT_VALUE);
    });

    it('should set selected to true for the selected stat (life or speed)', () => {
        service.assignBonus('life');
        expect(service.getCombinedStats().life.selected).toBe(STAT_SELECTED);
        expect(service.getCombinedStats().speed.selected).toBe(STAT_NOT_SELECTED);

        service.assignBonus('speed');
        expect(service.getCombinedStats().life.selected).toBe(STAT_NOT_SELECTED);
        expect(service.getCombinedStats().speed.selected).toBe(STAT_SELECTED);
    });
    it('should set selected to true for the selected stat (attack or defense)', () => {
        service.assignDiceSix('attack');
        expect(service.getCombinedStats().attack.selected).toBe(STAT_SELECTED);
        expect(service.getCombinedStats().defense.selected).toBe(STAT_NOT_SELECTED);

        service.assignDiceSix('defense');
        expect(service.getCombinedStats().attack.selected).toBe(STAT_NOT_SELECTED);
        expect(service.getCombinedStats().defense.selected).toBe(STAT_SELECTED);
    });
});
