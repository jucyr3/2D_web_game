import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceComponent } from './dice.component';

describe('DiceComponent', () => {
    let component: DiceComponent;
    let fixture: ComponentFixture<DiceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DiceComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle cahnge and swap dice images on clickDice', () => {
        const initialDice1 = component.dice1;
        const initialDice2 = component.dice2;

        component.clickDice();

        expect(component.cahnge).toBe(true);
        expect(component.dice1).toBe(initialDice2);
        expect(component.dice2).toBe(initialDice1);
    });

    it('should emit selected event with correct value on clickDice', () => {
        spyOn(component.selected, 'emit');

        component.clickDice();

        expect(component.selected.emit).toHaveBeenCalledWith(true);

        component.clickDice();

        expect(component.selected.emit).toHaveBeenCalledWith(false);
    });
});
