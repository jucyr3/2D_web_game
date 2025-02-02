import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushGridComponent } from './brush-grid.component';
import { provideTippyLoader, provideTippyConfig, tooltipVariation, popperVariation } from '@ngneat/helipopper/config';
describe('BrushGridComponent', () => {
    let component: BrushGridComponent;
    let fixture: ComponentFixture<BrushGridComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrushGridComponent],
            providers: [
                provideTippyConfig({
                    defaultVariation: 'tooltip',
                    variations: {
                        tooltip: tooltipVariation,
                        popper: popperVariation,
                    },
                }),
                provideTippyLoader(async () => import('tippy.js')),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BrushGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
