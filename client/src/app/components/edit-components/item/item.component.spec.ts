import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgClass, NgIf } from '@angular/common';
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { EditToolTypes } from '@app/services/editing-tool.constants';
import { EditingToolService } from '@app/services/editing-tool.service';
import { ITEM_CONTAINER_COORDINATES, ItemService } from '@app/services/item.service';
import { ItemObject } from '@common/ItemObject';
import { ItemTooltipComponent } from '@app/components/edit-components/item-tooltip/item-tooltip.component';
import { MouseService } from '@app/services/mouse.service';
import { ItemComponent } from './item.component';
import { provideTippyLoader, provideTippyConfig, tooltipVariation, popperVariation } from '@ngneat/helipopper/config';
import { TippyDirective } from '@ngneat/helipopper';

describe('ItemComponent', () => {
    let component: ItemComponent;
    let fixture: ComponentFixture<ItemComponent>;
    let mockDragAndDropService: jasmine.SpyObj<DragAndDropService>;
    let mockEditingToolService: jasmine.SpyObj<EditingToolService>;
    let mockItemService: jasmine.SpyObj<ItemService>;
    let mockMouseService: jasmine.SpyObj<MouseService>;
    let mockItemObject: ItemObject;

    // Helper function to setup the component with specific item data
    function setupComponent(itemId: string, item: ItemObject) {
        component.itemId = itemId;
        mockItemService.createItem.and.returnValue(item);
        fixture.detectChanges();
    }

    beforeEach(async () => {
        // Create spy objects for all services
        mockDragAndDropService = jasmine.createSpyObj('DragAndDropService', ['getDraggingState', 'startDragging', 'onMouseUp']);
        mockEditingToolService = jasmine.createSpyObj('EditingToolService', ['setActiveTool']);
        mockItemService = jasmine.createSpyObj('ItemService', ['createItem', 'decreaseItemAmount', 'increaseItemAmount']);
        mockMouseService = jasmine.createSpyObj('MouseService', ['isMouseDown']);

        // Initialize the mock item object
        mockItemObject = {
            name: 'test-item',
            // Add other required ItemObject properties here
        } as ItemObject;

        await TestBed.configureTestingModule({
            imports: [NgIf, NgClass, TippyDirective, ItemTooltipComponent, ItemComponent],
            providers: [
                { provide: DragAndDropService, useValue: mockDragAndDropService },
                { provide: EditingToolService, useValue: mockEditingToolService },
                { provide: ItemService, useValue: mockItemService },
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

        fixture = TestBed.createComponent(ItemComponent);
        component = fixture.componentInstance;

        // Setup default mock return values
        mockItemService.createItem.and.returnValue(mockItemObject);
        mockItemService.itemAmounts = { 'test-item': 1 };

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
        setupComponent('test-item-id', mockItemObject);
        expect(component).toBeTruthy();
    });

    it('should initialize itemObject on ngOnInit', () => {
        setupComponent('test-item-id', mockItemObject);

        expect(mockItemService.createItem).toHaveBeenCalledWith('test-item-id');
        expect(component.itemObject).toEqual(mockItemObject);
    });

    it('should call decreaseItemAmount and startDragging on mouse down when item amount > 0', () => {
        setupComponent('test-item-id', mockItemObject);
        const mockEvent = { clientX: 100, clientY: 200 } as MouseEvent;

        component.onMouseDown(mockEvent);

        expect(mockItemService.decreaseItemAmount).toHaveBeenCalledWith('test-item');
        expect(mockEditingToolService.setActiveTool).toHaveBeenCalledWith(EditToolTypes.Hand);
        expect(mockDragAndDropService.startDragging).toHaveBeenCalledWith(
            ITEM_CONTAINER_COORDINATES.row,
            ITEM_CONTAINER_COORDINATES.column,
            mockItemObject,
            mockEvent,
        );
    });

    it('should not call decreaseItemAmount or startDragging if item amount is zero', () => {
        setupComponent('test-item-id', mockItemObject);
        mockItemService.itemAmounts = { 'test-item': 0 };
        const mockEvent = { clientX: 100, clientY: 200 } as MouseEvent;

        component.onMouseDown(mockEvent);

        expect(mockItemService.decreaseItemAmount).not.toHaveBeenCalled();
        expect(mockEditingToolService.setActiveTool).not.toHaveBeenCalled();
        expect(mockDragAndDropService.startDragging).not.toHaveBeenCalled();
    });

    it('should call increaseItemAmount and onMouseUp when mouse up and dragging', () => {
        setupComponent('test-item-id', mockItemObject);

        component.onMouseUp();

        expect(mockItemService.increaseItemAmount).toHaveBeenCalledWith('test-item');
        expect(mockDragAndDropService.onMouseUp).toHaveBeenCalledWith('test-item');
        expect(mockEditingToolService.setActiveTool).toHaveBeenCalledWith(EditToolTypes.TileBrush);
    });

    it('should not call increaseItemAmount if not dragging on mouse up', () => {
        setupComponent('test-item-id', mockItemObject);
        mockDragAndDropService.getDraggingState.and.returnValue({
            isDragging: false,
            dragX: 0,
            dragY: 0,
        });

        component.onMouseUp();

        expect(mockItemService.increaseItemAmount).not.toHaveBeenCalled();
        expect(mockDragAndDropService.onMouseUp).not.toHaveBeenCalled();
    });

    it('should clean up dragging state on destroy', () => {
        setupComponent('test-item-id', mockItemObject);

        component.ngOnDestroy();

        expect(mockDragAndDropService.onMouseUp).toHaveBeenCalledWith('test-item');
    });
});
