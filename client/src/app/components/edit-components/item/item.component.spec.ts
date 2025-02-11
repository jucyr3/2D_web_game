import { NgClass } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemTooltipComponent } from '@app/components/edit-components/item-tooltip/item-tooltip.component';
import { DragAndDropService, ITEM_CONTAINER_COORDINATES } from '@app/services/edit-services/drag-and-drop.service';
import { EditingToolService, EditToolTypes } from '@app/services/edit-services/editing-tool.service';
import { MapService } from '@app/services/edit-services/map.service';
import { MouseService } from '@app/services/edit-services/mouse.service';
import { ItemObject } from '@common/ItemObject';
import { TippyDirective } from '@ngneat/helipopper';
import { popperVariation, provideTippyConfig, provideTippyLoader, tooltipVariation } from '@ngneat/helipopper/config';
import { ItemComponent } from '@app/components/edit-components/item/item.component';

/* eslint-disable @typescript-eslint/no-magic-numbers */

class MockItemManager {
    increaseItemAmount = jasmine.createSpy('increaseItemAmount');
    decreaseItemAmount = jasmine.createSpy('decreaseItemAmount');
    itemAmounts: { [itemId: string]: number } = {};
    items = new Map<string, boolean>();
    itemCounter = 0;
    maxItemCounter = 10;
}

class MockMapService {
    itemManager = new MockItemManager();
}

describe('ItemComponent', () => {
    let component: ItemComponent;
    let fixture: ComponentFixture<ItemComponent>;
    let mockDragAndDropService: jasmine.SpyObj<DragAndDropService>;
    let mockEditingToolService: jasmine.SpyObj<EditingToolService>;
    let mockMouseService: jasmine.SpyObj<MouseService>;
    let mockItemObject: ItemObject;
    let mockMapService: MockMapService;

    beforeEach(async () => {
        mockDragAndDropService = jasmine.createSpyObj('DragAndDropService', ['startDragging', 'onMouseUp', 'getDraggingState']);
        mockEditingToolService = jasmine.createSpyObj('EditingToolService', ['setActiveTool']);
        mockMouseService = jasmine.createSpyObj('MouseService', ['isMouseDown']);
        mockMapService = new MockMapService();

        mockItemObject = { name: 'testItem' };

        await TestBed.configureTestingModule({
            imports: [NgClass, TippyDirective, ItemTooltipComponent, ItemComponent],
            providers: [
                { provide: DragAndDropService, useValue: mockDragAndDropService },
                { provide: EditingToolService, useValue: mockEditingToolService },
                { provide: MouseService, useValue: mockMouseService },
                { provide: MapService, useValue: mockMapService },
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

        fixture = TestBed.createComponent(ItemComponent);
        component = fixture.componentInstance;

        mockMapService.itemManager.itemAmounts = { testItem: 1 };

        mockDragAndDropService.getDraggingState.and.returnValue({
            isDragging: true,
            dragX: 100,
            dragY: 200,
        });

        Object.defineProperty(mockDragAndDropService, 'currentDraggedItem', {
            get: () => mockItemObject,
        });
    });

    it('should create', () => {
        component.itemId = 'testItem';
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should not show toolTip if mouse is down', () => {
        mockMouseService.isMouseDown = true;
        fixture.detectChanges();
        expect(component.isTooltipEnabled).toBeFalse();
    });

    it('should return the correct item amount from mapService.itemManager.itemAmounts', () => {
        const itemId = 'testItem';
        component.itemId = itemId;
        component.itemObject = mockItemObject;

        mockMapService.itemManager.itemAmounts = { testItem: 5 };

        const itemAmount = component.itemAmount;

        expect(itemAmount).toBe(5);
        expect(mockMapService.itemManager.itemAmounts[itemId]).toBe(5);
    });

    it('should initialize itemObject with itemId on ngOnInit', () => {
        component.itemId = '123';
        fixture.detectChanges();
        expect(component.itemObject).toBeDefined();
        expect(component.itemObject).toEqual(jasmine.objectContaining<ItemObject>({ name: '123' }));
        expect(component.itemObject.name).toEqual('123');
    });

    it('should call decreaseItemAmount and startDragging on mouse down when item amount > 0 and not grayed out', () => {
        component.itemId = 'testItem';
        fixture.detectChanges();
        const mockEvent = { clientX: 100, clientY: 200, button: 0 } as MouseEvent;

        spyOn(component, 'isGrayedOut').and.returnValue(false);

        component.onMouseDown(mockEvent);

        expect(mockMapService.itemManager.decreaseItemAmount).toHaveBeenCalledWith('testItem');
        expect(mockEditingToolService.setActiveTool).toHaveBeenCalledWith(EditToolTypes.Hand);
        expect(mockDragAndDropService.startDragging).toHaveBeenCalledWith(
            ITEM_CONTAINER_COORDINATES.row,
            ITEM_CONTAINER_COORDINATES.column,
            mockItemObject,
            mockEvent,
        );
    });

    it('should not call decreaseItemAmount or startDragging if item amount is zero or grayed out', () => {
        component.itemId = 'testItem';
        mockMapService.itemManager.itemAmounts = { testItem: 0 };
        fixture.detectChanges();
        const mockEvent = { clientX: 100, clientY: 200 } as MouseEvent;

        spyOn(component, 'isGrayedOut').and.returnValue(true);

        component.onMouseDown(mockEvent);

        expect(mockMapService.itemManager.decreaseItemAmount).not.toHaveBeenCalled();
        expect(mockEditingToolService.setActiveTool).not.toHaveBeenCalled();
        expect(mockDragAndDropService.startDragging).not.toHaveBeenCalled();
    });

    it('should call increaseItemAmount and onMouseUp when mouse up and dragging', () => {
        component.itemId = 'testItem';
        fixture.detectChanges();

        component.onMouseUp();

        expect(mockMapService.itemManager.increaseItemAmount).toHaveBeenCalledWith('testItem');
        expect(mockDragAndDropService.onMouseUp).toHaveBeenCalledWith('testItem');
        expect(mockEditingToolService.setActiveTool).toHaveBeenCalledWith(EditToolTypes.TileBrush);
    });

    it('should not call increaseItemAmount if not dragging on mouse up', () => {
        component.itemId = 'testItem';
        mockDragAndDropService.getDraggingState.and.returnValue({
            isDragging: false,
            dragX: 0,
            dragY: 0,
        });
        fixture.detectChanges();

        component.onMouseUp();

        expect(mockMapService.itemManager.increaseItemAmount).not.toHaveBeenCalled();
        expect(mockDragAndDropService.onMouseUp).not.toHaveBeenCalled();
    });

    it('should clean up dragging state on destroy', () => {
        component.itemId = 'testItem';
        fixture.detectChanges();

        component.ngOnDestroy();

        expect(mockDragAndDropService.onMouseUp).toHaveBeenCalledWith('testItem');
    });
});
