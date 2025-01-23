import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushGridComponent } from './brush-grid.component';

describe('BrushGridComponent', () => {
    let component: BrushGridComponent;
    let fixture: ComponentFixture<BrushGridComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrushGridComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BrushGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
