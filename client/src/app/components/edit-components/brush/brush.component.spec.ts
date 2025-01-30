import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrushComponent } from './brush.component';
import { EditToolTypes } from '@app/services/editing-tool.constants';
import { TileTypes } from '@common/tileType.constants';
import { EditingToolService } from '@app/services/editing-tool.service';
import { MapService } from '@app/services/map.service';
import { TileComponent } from '@app/components/edit-components/tile/tile.component';
import { provideTippyLoader, provideTippyConfig, tooltipVariation, popperVariation } from '@ngneat/helipopper/config';
import { TippyDirective } from '@ngneat/helipopper';

describe('BrushComponent', () => {
    let component: BrushComponent;
    let fixture: ComponentFixture<BrushComponent>;

    // Mock services
    const editingToolServiceMock = {
        setActiveTool: jasmine.createSpy('setActiveTool'),
        setTileTypeOnBrush: jasmine.createSpy('setTileTypeOnBrush'),
    };

    const mapServiceMock = {
        getItemObject: jasmine.createSpy('getItemObject').and.returnValue({
            // Add whatever properties your itemObject should have
            id: 1,
            type: TileTypes.GROUND_0,
            // ... other required properties
        }),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrushComponent, TileComponent, TippyDirective], // Import both components
            providers: [
                { provide: EditingToolService, useValue: editingToolServiceMock },
                { provide: MapService, useValue: mapServiceMock }, // Provide the MapService mock
                provideTippyConfig({
                                    defaultVariation: 'tooltip',
                                    variations: {
                                        tooltip: tooltipVariation,
                                        popper: popperVariation,
                                    },
                                }),
                provideTippyLoader(() => import('tippy.js')),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BrushComponent);
        component = fixture.componentInstance;

        // Reset spies before each test
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

    it('should call setActiveTool with the provided tool when changeTool is called', () => {
        const tool = EditToolTypes.Hand;
        component.changeTool(tool);

        expect(editingToolServiceMock.setActiveTool).toHaveBeenCalledWith(tool);
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
