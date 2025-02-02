import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrushTooltipComponent } from './brush-tooltip.component';
import { TIPPY_REF } from '@ngneat/helipopper';
import { tileDescription } from '@app/../assets/tiles/tile-description';
import { TileTypes } from '@common/tileType.constants';

/* eslint-disable */

describe('BrushTooltipComponent', () => {
    let component: BrushTooltipComponent;
    let fixture: ComponentFixture<BrushTooltipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrushTooltipComponent],
            providers: [
                { provide: TIPPY_REF, useValue: {} }, // Mock TIPPY_REF
                { provide: 'tileDescription', useValue: tileDescription }, // Mock tileDescription
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BrushTooltipComponent);
        component = fixture.componentInstance;

        // Set a default value for tileType to avoid undefined errors
        component.tileType = TileTypes.GROUND_2;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set tileName and tileDescription based on tileType input', () => {
        // Verify the computed properties for the default tileType
        expect(component.tileName).toBe(tileDescription[TileTypes.GROUND_2].name);
        expect(component.tileDescription).toBe(tileDescription[TileTypes.GROUND_2].description);

        // Change the input value
        component.tileType = TileTypes.GROUND_0;
        fixture.detectChanges();

        // Verify the updated computed properties
        expect(component.tileName).toBe(tileDescription[TileTypes.GROUND_0].name);
        expect(component.tileDescription).toBe(tileDescription[TileTypes.GROUND_0].description);
    });

    it('should handle unknown tileType gracefully', () => {
        // Set an unknown tileType
        component.tileType = 'unknown';
        fixture.detectChanges();

        // Verify that the computed properties handle the unknown case
        expect(component.tileName).toBe('unknown tile');
        expect(component.tileDescription).toBe('unknown tile so no description');
    });

    it('should have tippy reference defined', () => {
        expect(component.tippy).toBeDefined();
    });
});
