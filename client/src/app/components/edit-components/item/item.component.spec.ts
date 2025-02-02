import { NgClass, NgIf } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemTooltipComponent } from '@app/components/edit-components/item-tooltip/item-tooltip.component';
import { DragAndDropService, ITEM_CONTAINER_COORDINATES } from '@app/services/drag-and-drop.service';
import { EditToolTypes } from '@app/services/editing-tool.constants';
import { EditingToolService } from '@app/services/editing-tool.service';
import { MapService } from '@app/services/map.service';
import { MouseService } from '@app/services/mouse.service';
import { ItemObject } from '@common/ItemObject';
import { TippyDirective } from '@ngneat/helipopper';
import { popperVariation, provideTippyConfig, provideTippyLoader, tooltipVariation } from '@ngneat/helipopper/config';
import { ItemComponent } from '@app/components/edit-components/item/item.component';

/* eslint-disable */

class MockItemManager {
    increaseItemAmount = jasmine.createSpy('increaseItemAmount');
    decreaseItemAmount = jasmine.createSpy('decreaseItemAmount');
    itemAmounts: { [itemId: string]: number } = {};
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
        // Create spy objects for all services
        mockDragAndDropService = jasmine.createSpyObj('DragAndDropService', ['startDragging', 'onMouseUp', 'getDraggingState']);
        mockEditingToolService = jasmine.createSpyObj('EditingToolService', ['setActiveTool']);
        mockMouseService = jasmine.createSpyObj('MouseService', ['isMouseDown']);
        mockMapService = new MockMapService();

        // Initialize the mock item object
        mockItemObject = new ItemObject('test-item');

        await TestBed.configureTestingModule({
            imports: [NgIf, NgClass, TippyDirective, ItemTooltipComponent, ItemComponent],
            providers: [
                { provide: DragAndDropService, useValue: mockDragAndDropService },
                { provide: EditingToolService, useValue: mockEditingToolService },
                { provide: MouseService, useValue: mockMouseService },
                { provide: MapService, useValue: mockMapService }, // Use the mock instance
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

        // Setup default mock return values
        mockMapService.itemManager.itemAmounts = { 'test-item': 1 };

        // Setup drag and drop state mock
        mockDragAndDropService.getDraggingState.and.returnValue({
            isDragging: true,
            dragX: 100,
            dragY: 200,
        });

        // Define the currentDraggedItem getter
        Object.defineProperty(mockDragAndDropService, 'currentDraggedItem', {
            get: () => mockItemObject,
        });
    });

    it('should create', () => {
        component.itemId = 'test-item';
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should return the correct item amount from mapService.itemManager.itemAmounts', () => {
        // Setup the component with a specific itemId and mock itemObject
        const itemId = 'test-item';
        const mockItemObject = new ItemObject(itemId);
        component.itemId = itemId;
        component.itemObject = mockItemObject;

        mockMapService.itemManager.itemAmounts = { 'test-item': 5 };

        const itemAmount = component.itemAmount;

        expect(itemAmount).toBe(5);
        expect(mockMapService.itemManager.itemAmounts[itemId]).toBe(5);
    });

    it('should initialize itemObject with itemId on ngOnInit', () => {
        component.itemId = '123';
        fixture.detectChanges();
        expect(component.itemObject).toBeDefined();
        expect(component.itemObject instanceof ItemObject).toBeTrue();
        expect(component.itemObject.name).toEqual('123');
    });

    it('should call decreaseItemAmount and startDragging on mouse down when item amount > 0', () => {
        component.itemId = 'test-item';
        fixture.detectChanges();
        const mockEvent = { clientX: 100, clientY: 200, button: 0 } as MouseEvent;

        component.onMouseDown(mockEvent);

        expect(mockMapService.itemManager.decreaseItemAmount).toHaveBeenCalledWith('test-item');
        expect(mockEditingToolService.setActiveTool).toHaveBeenCalledWith(EditToolTypes.Hand);
        expect(mockDragAndDropService.startDragging).toHaveBeenCalledWith(
            ITEM_CONTAINER_COORDINATES.row,
            ITEM_CONTAINER_COORDINATES.column,
            mockItemObject,
            mockEvent,
        );
    });

    it('should not call decreaseItemAmount or startDragging if item amount is zero', () => {
        component.itemId = 'test-item';
        mockMapService.itemManager.itemAmounts = { 'test-item': 0 };
        fixture.detectChanges();
        const mockEvent = { clientX: 100, clientY: 200 } as MouseEvent;

        component.onMouseDown(mockEvent);

        expect(mockMapService.itemManager.decreaseItemAmount).not.toHaveBeenCalled();
        expect(mockEditingToolService.setActiveTool).not.toHaveBeenCalled();
        expect(mockDragAndDropService.startDragging).not.toHaveBeenCalled();
    });

    it('should call increaseItemAmount and onMouseUp when mouse up and dragging', () => {
        component.itemId = 'test-item';
        fixture.detectChanges();

        component.onMouseUp();

        expect(mockMapService.itemManager.increaseItemAmount).toHaveBeenCalledWith('test-item');
        expect(mockDragAndDropService.onMouseUp).toHaveBeenCalledWith('test-item');
        expect(mockEditingToolService.setActiveTool).toHaveBeenCalledWith(EditToolTypes.TileBrush);
    });

    it('should not call increaseItemAmount if not dragging on mouse up', () => {
        component.itemId = 'test-item';
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
        component.itemId = 'test-item';
        fixture.detectChanges();

        component.ngOnDestroy();

        expect(mockDragAndDropService.onMouseUp).toHaveBeenCalledWith('test-item');
    });
});
