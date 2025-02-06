import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TileGridComponent } from './tile-grid.component';
import { TileComponent } from '@app/components/edit-components/tile/tile.component';
import { DragAndDropService } from '@app/services/edit-services/drag-and-drop.service';
import { EditingToolService } from '@app/services/edit-services/editing-tool.service';
import { MouseService } from '@app/services/edit-services/mouse.service';
import { Renderer2 } from '@angular/core';

describe('TileGridComponent', () => {
    let component: TileGridComponent;
    let fixture: ComponentFixture<TileGridComponent>;
    let mockDragAndDropService: jasmine.SpyObj<DragAndDropService>;
    let mockEditingToolService: jasmine.SpyObj<EditingToolService>;
    let mouseService: MouseService;
    const mockRenderer = jasmine.createSpyObj('Renderer2', ['listen']);

    beforeEach(async () => {
        mockDragAndDropService = jasmine.createSpyObj('DragAndDropService', ['setCurrentHoveredTile']);

        mockEditingToolService = jasmine.createSpyObj('EditingToolService', ['resetInterpolationPoints', 'resetProcessedTiles']);

        await TestBed.configureTestingModule({
            imports: [TileGridComponent, TileComponent],
            providers: [
                MouseService,
                { provide: Renderer2, useValue: mockRenderer },
                { provide: DragAndDropService, useValue: mockDragAndDropService },
                { provide: EditingToolService, useValue: mockEditingToolService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TileGridComponent);
        component = fixture.componentInstance;
        mouseService = TestBed.inject(MouseService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should handle mouse leave', () => {
        component.onMouseLeave();
        expect(mockDragAndDropService.setCurrentHoveredTile).toHaveBeenCalledWith(-1, -1);
        expect(mockEditingToolService.resetInterpolationPoints).toHaveBeenCalled();
    });

    it('should handle mouse up', () => {
        component.onMouseUp();
        expect(mockEditingToolService.resetInterpolationPoints).toHaveBeenCalled();
        expect(mockEditingToolService.resetProcessedTiles).toHaveBeenCalled();
    });

    it('should handle mouse down with right click', () => {
        const mockEvent = { button: 2 } as MouseEvent;
        component.onMouseDown(mockEvent);

        expect(mouseService.isRightClick).toBe(true);
    });

    it('should prevent default action on context menu', () => {
        const mockEvent = new MouseEvent('contextmenu');
        spyOn(mockEvent, 'preventDefault');

        component.onContextMenu(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
});
