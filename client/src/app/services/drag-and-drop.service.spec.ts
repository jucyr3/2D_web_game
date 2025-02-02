import { TestBed } from '@angular/core/testing';
import { DragAndDropService } from './drag-and-drop.service';
import { MapService } from './map.service';
import { ItemObject } from '@common/ItemObject';
import { TileTypes } from '@common/tileType.constants';

describe('DragAndDropService', () => {
    let service: DragAndDropService;
    let mockMapService: jasmine.SpyObj<MapService>;

    beforeEach(() => {
        mockMapService = jasmine.createSpyObj('MapService', [
            'getTileType',
            'getItemObject',
            'placeGameObject',
            'resetItemToStartPosition',
            'itemManager',
        ]);
        mockMapService.itemManager = jasmine.createSpyObj('ItemManager', ['increaseItemAmount']);

        TestBed.configureTestingModule({
            providers: [DragAndDropService, { provide: MapService, useValue: mockMapService }],
        });
        service = TestBed.inject(DragAndDropService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set currentHoveredTile correctly', () => {
        service.setCurrentHoveredTile(5, 6);
        expect(service.currentHoveredTile).toEqual({ row: 5, column: 6 });
    });

    it('should start dragging with correct values', () => {
        const mockItem = new ItemObject('testItem');
        const event = new MouseEvent('mousedown', { clientX: 100, clientY: 200 });

        service.startDragging(2, 3, mockItem, event);

        expect(service.currentDraggedItem).toBe(mockItem);
        expect(service.isDragging).toBeTrue();
        expect(service.startTile).toEqual({ row: 2, column: 3 });
        expect(service.getDraggingState(mockItem.name)).toEqual({ isDragging: true, dragX: 100, dragY: 200 });
    });

    it('should update dragging state on mouse move', () => {
        const mockItem = new ItemObject('testItem');
        const startEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 200 });
        service.startDragging(2, 3, mockItem, startEvent);

        const moveEvent = new MouseEvent('mousemove', { clientX: 150, clientY: 250 });
        service.onMouseMove(mockItem.name, moveEvent);

        expect(service.getDraggingState(mockItem.name)).toEqual({ isDragging: true, dragX: 150, dragY: 250 });
    });

    it('should stop dragging on mouse up', () => {
        const mockItem = new ItemObject('testItem');
        const startEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 200 });
        service.startDragging(2, 3, mockItem, startEvent);

        service.onMouseUp(mockItem.name);

        expect(service.isDragging).toBeFalse();
        expect(service.currentDraggedItem).toBeNull();
        expect(service.getDraggingState(mockItem.name).isDragging).toBeFalse();
    });

    it('should handle dragged item placement correctly', () => {
        const mockItem = new ItemObject('testItem');
        service.startDragging(2, 3, mockItem, new MouseEvent('mousedown'));

        mockMapService.getTileType.and.returnValue(TileTypes.GROUND_1);
        mockMapService.getItemObject.and.returnValue(null);
        service.setCurrentHoveredTile(4, 5);
        service.handleDraggedItemPlacement(4, 5);

        expect(mockMapService.placeGameObject).toHaveBeenCalledWith(4, 5, mockItem);
    });

    it('should handle dragged item placement correctly if there is no currently dragged item', () => {
        const mockItem = new ItemObject('testItem');
        service.startDragging(2, 3, mockItem, new MouseEvent('mousedown'));

        mockMapService.getTileType.and.returnValue(TileTypes.GROUND_1);
        mockMapService.getItemObject.and.returnValue(null);
        service['_currentDraggedItem'] = null;
        service.setCurrentHoveredTile(4, 5);
        service.handleDraggedItemPlacement(4, 5);

        expect(mockMapService.placeGameObject).not.toHaveBeenCalled();
    });

    it('should handle invalid item placement if on wall or occupied tile', () => {
        const mockItem = new ItemObject('testItem');
        service.startDragging(2, 3, mockItem, new MouseEvent('mousedown'));

        mockMapService.getTileType.and.returnValue(TileTypes.WALL);
        service.handleDraggedItemPlacement(4, 5);

        expect(mockMapService.resetItemToStartPosition).toHaveBeenCalledWith(2, 3, mockItem);
    });

    it('should increase item amount if item is from container', () => {
        const mockItem = new ItemObject('testItem');
        service.startDragging(-2, -2, mockItem, new MouseEvent('mousedown'));

        service.handleDraggedItemPlacement(4, 5);

        expect(mockMapService.itemManager.increaseItemAmount).toHaveBeenCalledWith('testItem');
    });
});
