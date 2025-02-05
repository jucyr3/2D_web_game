import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrushTooltipComponent } from './brush-tooltip.component';
import { TIPPY_REF } from '@ngneat/helipopper';
import { tileDetails } from 'src/assets/tiles/tile-details';
import { TileTypes } from '@common/tileType.constants';

describe('BrushTooltipComponent', () => {
    let component: BrushTooltipComponent;
    let fixture: ComponentFixture<BrushTooltipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrushTooltipComponent],
            providers: [
                { provide: TIPPY_REF, useValue: {} },
                { provide: 'tileDescription', useValue: tileDetails },
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
        expect(component.tileNameText).toBe(tileDetails[TileTypes.GROUND_2].name);
        expect(component.tileDescriptionText).toBe(tileDetails[TileTypes.GROUND_2].description);

        component.tileType = TileTypes.GROUND_0;
        fixture.detectChanges();

        expect(component.tileNameText).toBe(tileDetails[TileTypes.GROUND_0].name);
        expect(component.tileDescriptionText).toBe(tileDetails[TileTypes.GROUND_0].description);
    });

    it('should have tippy reference defined', () => {
        expect(component.tippy).toBeDefined();
    });
});
