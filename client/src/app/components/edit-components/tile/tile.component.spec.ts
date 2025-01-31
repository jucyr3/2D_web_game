import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgStyle } from '@angular/common';
import { TileComponent } from './tile.component';
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditingToolService } from '@app/services/editing-tool.service';
import { ItemService} from '@app/services/item.service';
import { MapService } from '@app/services/map.service';
import { MouseService } from '@app/services/mouse.service';
import { EditToolTypes } from '@app/services/editing-tool.constants';
import { Tile } from '@common/tile';
import { ItemObject } from '@common/ItemObject';
import { ItemTooltipComponent } from '@app/components/edit-components/item-tooltip/item-tooltip.component';
import { provideTippyLoader, provideTippyConfig, tooltipVariation, popperVariation } from '@ngneat/helipopper/config';
import { TippyDirective } from '@ngneat/helipopper';

describe('TileComponent', () => {
    let component: TileComponent;
    let fixture: ComponentFixture<TileComponent>;
    let mockDragAndDropService: jasmine.SpyObj<DragAndDropService>;
    let mockEditingToolService: jasmine.SpyObj<EditingToolService>;
    let mockItemService: jasmine.SpyObj<ItemService>;
    let mockMapService: jasmine.SpyObj<MapService>;
    let mockMouseService: jasmine.SpyObj<MouseService>;

    beforeEach(async () => {
        mockDragAndDropService = jasmine.createSpyObj('DragAndDropService', ['startDragging', 'handleDraggedItemPlacement', 'onMouseUp', 'setCurrentHoveredTile']);
        mockEditingToolService = jasmine.createSpyObj('EditingToolService', ['setActiveTool', 'setInterpolationPoints', 'onMouseUp', 'removeItemObjectFromTile']);
        mockItemService = jasmine.createSpyObj('ItemService', ['decreaseItemAmount']);
        mockMapService = jasmine.createSpyObj('MapService', ['getTileTexture', 'getItemObject', 'removeGameObject']);
        mockMouseService = jasmine.createSpyObj('MouseService', [], {isMouseDown: false, isRightClick: false});

        await TestBed.configureTestingModule({
            imports: [NgStyle, TippyDirective, ItemTooltipComponent, TileComponent],
            providers: [
                { provide: DragAndDropService, useValue: mockDragAndDropService },
                { provide: EditingToolService, useValue: mockEditingToolService },
                { provide: ItemService, useValue: mockItemService },
                { provide: MapService, useValue: mockMapService },
                { provide: MouseService, useValue: mockMouseService },
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

        fixture = TestBed.createComponent(TileComponent);
        component = fixture.componentInstance;
        component.tileNumber = 0;
        component.tileObject = {} as Tile;
        mockMapService.map = { size: 10 } as any;

        // Mock the currentDraggedItem as a read-only property
        Object.defineProperty(mockDragAndDropService, 'currentDraggedItem', {
            get: () => ({ name: 'MockedItem' } as ItemObject),
            configurable: true
        });

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize tile position correctly', () => {
        expect(component.tilePosition).toEqual({ row: 0, column: 0 });
    });

    it('should get tile texture', () => {
        mockMapService.getTileTexture.and.returnValue('texture.png');
        expect(component.tileTexture).toBe('texture.png');
        expect(mockMapService.getTileTexture).toHaveBeenCalledWith(0, 0);
    });

    it('should get item object', () => {
        const mockItem = { name: 'TestItem' } as ItemObject;
        mockMapService.getItemObject.and.returnValue(mockItem);
        expect(component.itemObject).toBe(mockItem);
        expect(mockMapService.getItemObject).toHaveBeenCalledWith(0, 0);
    });

    it('should handle mouse down event', () => {
        const mockEvent = { button: 0 } as MouseEvent;
        const mockItem = { name: 'TestItem' } as ItemObject;
        mockMapService.getItemObject.and.returnValue(mockItem);

        component.onMouseDown(mockEvent);

        expect(mockEditingToolService.setActiveTool).toHaveBeenCalledWith(EditToolTypes.Hand);
        expect(mockDragAndDropService.startDragging).toHaveBeenCalledWith(0, 0, mockItem, mockEvent);
        expect(mockMapService.removeGameObject).toHaveBeenCalledWith(0, 0);
        expect(mockEditingToolService.setInterpolationPoints).toHaveBeenCalledWith({ row: 0, column: 0 });
    });

    it('should handle mouse up event', () => {
        component.onMouseUp();

        expect(mockMouseService.isMouseDown).toBe(false);
        expect(mockEditingToolService.onMouseUp).toHaveBeenCalled();
        expect(mockDragAndDropService.handleDraggedItemPlacement).toHaveBeenCalledWith(0, 0);
        expect(mockDragAndDropService.onMouseUp).toHaveBeenCalledWith('MockedItem');
    });

    it('should handle mouse enter event', () => {
        Object.defineProperty(mockMouseService, 'isMouseDown', { get: () => true });

        component.onMouseEnter();

        expect(mockEditingToolService.setInterpolationPoints).toHaveBeenCalledWith({ row: 0, column: 0 });
        expect(mockDragAndDropService.setCurrentHoveredTile).toHaveBeenCalledWith(0, 0);
    });

    it('should handle right click event', () => {
        const mockItem = { name: 'TestItem' } as ItemObject;
        mockMapService.getItemObject.and.returnValue(mockItem);

        component.onRightClick();

        expect(mockEditingToolService.removeItemObjectFromTile).toHaveBeenCalledWith(0, 0, mockItem);
    });

    it('should check if tooltip is enabled', () => {
        mockMapService.getItemObject.and.returnValue({ name: 'TestItem' } as ItemObject);
        Object.defineProperty(mockMouseService, 'isMouseDown', { get: () => false });
        expect(component.isTooltipEnabled).toBe(true);

        Object.defineProperty(mockMouseService, 'isMouseDown', { get: () => true });
        expect(component.isTooltipEnabled).toBe(false);

        mockMapService.getItemObject.and.returnValue(null);
        expect(component.isTooltipEnabled).toBe(false);
    });
});
