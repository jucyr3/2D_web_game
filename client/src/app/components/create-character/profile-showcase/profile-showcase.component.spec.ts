import { ComponentFixture, TestBed } from '@angular/core/testing';
import { characterConstants } from '@app/constants/characterConstants';
import { StatsService } from '@app/services/create-character/stats.service';
import { ProfileShowcaseComponent } from './profile-showcase.component';

describe('ProfileShowcaseComponent', () => {
    let component: ProfileShowcaseComponent;
    let fixture: ComponentFixture<ProfileShowcaseComponent>;
    let statsService: StatsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfileShowcaseComponent],
            providers: [StatsService],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileShowcaseComponent);
        component = fixture.componentInstance;
        statsService = TestBed.inject(StatsService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call assignBonus on StatsService with correct stat', () => {
        spyOn(statsService, 'assignBonus');
        component.assignBonus('life');
        expect(statsService.assignBonus).toHaveBeenCalledWith('life');
    });

    it('should call assignDiceSix on StatsService with correct stat', () => {
        spyOn(statsService, 'assignDiceSix');
        component.assignDiceSix('attack');
        expect(statsService.assignDiceSix).toHaveBeenCalledWith('attack');
    });

    it('should initialize combinedStats correctly', () => {
        expect(component.combinedStats).toEqual(statsService.getCombinedStats());
    });

    it('should update combinedStats correctly after assignBonus', () => {
        component.assignBonus('speed');
        expect(component.combinedStats.speed.stat).toBe(characterConstants.addedBonus);
        expect(component.combinedStats.speed.selected).toBeTrue();
        expect(component.combinedStats.life.selected).toBeFalse();
    });

    it('should update combinedStats correctly after assignDiceSix', () => {
        component.assignDiceSix('defense');
        expect(component.combinedStats.defense.selected).toBeTrue();
        expect(component.combinedStats.attack.selected).toBeFalse();
    });

    it('should not modify other stats when assignBonus is called', () => {
        const initialAttackStat = component.combinedStats.attack.stat;
        const initialDefenseStat = component.combinedStats.defense.stat;
        component.assignBonus('life');
        expect(component.combinedStats.attack.stat).toBe(initialAttackStat);
        expect(component.combinedStats.defense.stat).toBe(initialDefenseStat);
    });
});
