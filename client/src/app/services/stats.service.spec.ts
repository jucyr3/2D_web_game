import { TestBed } from '@angular/core/testing';

import { StatsService } from './stats.service';

fdescribe('StatsService', () => {
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
        expect(service.getCombinedStats().life.stat).toBe(6);
        expect(service.getCombinedStats().speed.stat).toBe(4);
        expect(service.getCombinedStats().attack.stat).toBe(4);
        expect(service.getCombinedStats().defense.stat).toBe(4);
    });

    it('should set selected to true for the selected stat (life or speed)', () => {
        service.assignBonus('life');
        expect(service.getCombinedStats().life.selected).toBe(true);
        expect(service.getCombinedStats().speed.selected).toBe(false);

        service.assignBonus('speed');
        expect(service.getCombinedStats().life.selected).toBe(false);
        expect(service.getCombinedStats().speed.selected).toBe(true);
    });
    it('should set selected to true for the selected stat (attack or defense)', () => {
        service.assignDiceSix('attack');
        expect(service.getCombinedStats().attack.selected).toBe(true);
        expect(service.getCombinedStats().defense.selected).toBe(false);

        service.assignDiceSix('defense');
        expect(service.getCombinedStats().attack.selected).toBe(false);
        expect(service.getCombinedStats().defense.selected).toBe(true);
    });

});
