import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TileComponent } from '@app/components/edit-components/tile/tile.component';
import { EditingToolService, EditToolTypes } from '@app/services/editing-tool.service';
import { MapService } from '@app/services/map.service';
import { TileTypes } from '@common/tileType.constants';
import { TippyDirective } from '@ngneat/helipopper';
import { popperVariation, provideTippyConfig, provideTippyLoader, tooltipVariation } from '@ngneat/helipopper/config';
import { BrushComponent } from './brush.component';

describe('BrushComponent', () => {
    let component: BrushComponent;
    let fixture: ComponentFixture<BrushComponent>;

    const editingToolServiceMock = {
        setActiveTool: jasmine.createSpy('setActiveTool'),
        setTileTypeOnBrush: jasmine.createSpy('setTileTypeOnBrush'),
    };

    const mapServiceMock = {
        getItemObject: jasmine.createSpy('getItemObject').and.returnValue({
            id: 1,
            type: TileTypes.GROUND_0,
        }),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrushComponent, TileComponent, TippyDirective],
            providers: [
                { provide: EditingToolService, useValue: editingToolServiceMock },
                { provide: MapService, useValue: mapServiceMock },
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

        fixture = TestBed.createComponent(BrushComponent);
        component = fixture.componentInstance;

        editingToolServiceMock.setActiveTool.calls.reset();
        editingToolServiceMock.setTileTypeOnBrush.calls.reset();
        mapServiceMock.getItemObject.calls.reset();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call setActiveTool with TileBrush and setTileTypeOnBrush with the provided tileType when changeBrushTile is called', () => {
        const tileType = TileTypes.GROUND_0;
        component.changeBrushTile(tileType);

        expect(editingToolServiceMock.setActiveTool).toHaveBeenCalledWith(EditToolTypes.TileBrush);
        expect(editingToolServiceMock.setTileTypeOnBrush).toHaveBeenCalledWith(tileType);
    });

    it('should correctly bind the tileType input', () => {
        const tileType = TileTypes.GROUND_2;
        component.tileType = tileType;
        fixture.detectChanges();

        expect(component.tileType).toEqual(tileType);
    });

    it('should correctly bind the isActive input', () => {
        const isActive = true;
        component.isActive = isActive;
        fixture.detectChanges();

        expect(component.isActive).toEqual(isActive);
    });
});
