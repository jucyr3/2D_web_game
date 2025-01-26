import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatComponent } from './stat.component';

describe('StatComponent', () => {
    let component: StatComponent;
    let fixture: ComponentFixture<StatComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StatComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit selected event with true when clickItem is called with true', () => {
        spyOn(component.selected, 'emit');
        component.clickItem(true);
        expect(component.cahnge).toBeTrue();
        expect(component.selected.emit).toHaveBeenCalledWith(true);
    });

    it('should emit selected event with false when clickItem is called with false', () => {
        spyOn(component.selected, 'emit');
        component.clickItem(false);
        expect(component.cahnge).toBeFalse();
        expect(component.selected.emit).toHaveBeenCalledWith(false);
    });
});
