import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProfileService } from '@app/services/profile.service';
import { DiceComponent } from './dice.component';

describe('DiceComponent', () => {
    let component: DiceComponent;
    let fixture: ComponentFixture<DiceComponent>;
    let profileService: ProfileService;

    beforeEach(async () => {
        profileService = jasmine.createSpyObj('ProfileService', ['setDiceChoice']);

        await TestBed.configureTestingModule({
            imports: [DiceComponent],
            providers: [{ provide: ProfileService, useValue: profileService }],
        }).compileComponents();

        fixture = TestBed.createComponent(DiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle channge and swap dice images on clickDice', () => {
        const initialDice1 = component.dice1;
        const initialDice2 = component.dice2;

        component.clickDice();

        expect(component.change).toBe(true);
        expect(component.dice1).toBe(initialDice2);
        expect(component.dice2).toBe(initialDice1);
    });

    it('should call setDiceChoice on clickDice', () => {
        component.clickDice();
        expect(profileService.setDiceChoice).toHaveBeenCalledWith(true);

        component.clickDice();
        expect(profileService.setDiceChoice).toHaveBeenCalledWith(false);
    });

    it('should update the DOM when clickDice is called', () => {
        const diceImages = fixture.debugElement.queryAll(By.css('img'));
        expect(diceImages.length).toBe(2);

        const initialSrc1 = diceImages[0].nativeElement.src;
        const initialSrc2 = diceImages[1].nativeElement.src;

        component.clickDice();
        fixture.detectChanges();

        expect(diceImages[0].nativeElement.src).toBe(initialSrc2);
        expect(diceImages[1].nativeElement.src).toBe(initialSrc1);
    });

    it('should have initial dice images set correctly', () => {
        expect(component.dice1).toBe('assets/images/dice1.png');
        expect(component.dice2).toBe('assets/images/dice2.png');
    });

    it('should toggle channge property correctly', () => {
        expect(component.change).toBe(false);

        component.clickDice();
        expect(component.change).toBe(true);

        component.clickDice();
        expect(component.change).toBe(false);
    });
});
