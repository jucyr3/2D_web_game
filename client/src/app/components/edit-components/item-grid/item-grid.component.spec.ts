import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGridComponent } from './item-grid.component';
import { provideTippyLoader, provideTippyConfig, tooltipVariation, popperVariation } from '@ngneat/helipopper/config';

describe('ItemGridComponent', () => {
    let component: ItemGridComponent;
    let fixture: ComponentFixture<ItemGridComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ItemGridComponent],
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

        fixture = TestBed.createComponent(ItemGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
