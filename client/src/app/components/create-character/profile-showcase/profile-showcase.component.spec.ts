import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileShowcaseComponent } from './profile-showcase.component';

describe('ProfileShowcaseComponent', () => {
    let component: ProfileShowcaseComponent;
    let fixture: ComponentFixture<ProfileShowcaseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfileShowcaseComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileShowcaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update imagePath on profileChosed change', () => {
        component.profileChosed = 1;
        component.ngOnChanges({
            profileChosed: {
                currentValue: 1,
                previousValue: null,
                firstChange: true,
                isFirstChange: () => true,
            },
        });
        expect(component.imagePath).toBe('assets/images/1.jpg');
    });

    it('should set bonus to true when clickBonus is called with true', () => {
        component.clickBonus(true);
        expect(component.bonus).toBe(true);
    });

    it('should set bonus to false when clickBonus is called with false', () => {
        component.clickBonus(false);
        expect(component.bonus).toBe(false);
    });

    it('should set dice to true when clickDice is called with true', () => {
        component.clickDice(true);
        expect(component.dice).toBe(true);
    });

    it('should set dice to false when clickDice is called with false', () => {
        component.clickDice(false);
        expect(component.dice).toBe(false);
    });
});
