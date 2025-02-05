import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrushTooltipComponent } from './brush-tooltip.component';
import { TIPPY_REF } from '@ngneat/helipopper';
import { tileDescription } from '@app/../assets/tiles/tile-description';
import { TileTypes } from '@common/tileType.constants';

describe('BrushTooltipComponent', () => {
    let component: BrushTooltipComponent;
    let fixture: ComponentFixture<BrushTooltipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrushTooltipComponent],
            providers: [
                { provide: TIPPY_REF, useValue: {} },
                { provide: 'tileDescription', useValue: tileDescription },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BrushTooltipComponent);
        component = fixture.componentInstance;

        component.tileType = TileTypes.GROUND_2;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set tileName and tileDescription based on tileType input', () => {
        expect(component.tileNameText).toBe(tileDescription[TileTypes.GROUND_2].name);
        expect(component.tileDescriptionText).toBe(tileDescription[TileTypes.GROUND_2].description);

        component.tileType = TileTypes.GROUND_0;
        fixture.detectChanges();

        expect(component.tileNameText).toBe(tileDescription[TileTypes.GROUND_0].name);
        expect(component.tileDescriptionText).toBe(tileDescription[TileTypes.GROUND_0].description);
    });

    // it('should handle unknown tileType gracefully', () => {
    //     component.tileType = 'unknown';
    //     fixture.detectChanges();

    //     expect(component.tileNameText).toBe('unknown tile');
    //     expect(component.tileDescriptionText).toBe('unknown tile so no description');
    // });

    it('should have tippy reference defined', () => {
        expect(component.tippy).toBeDefined();
    });
});
