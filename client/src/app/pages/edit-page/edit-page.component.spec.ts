import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPageComponent } from './edit-page.component';
import { provideTippyLoader, provideTippyConfig, tooltipVariation, popperVariation } from '@ngneat/helipopper/config';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DragAndDropService } from '@app/services/drag-and-drop.service';
import { MouseService } from '@app/services/mouse.service';
import { of } from 'rxjs';

describe('EditPageComponent', () => {
    let component: EditPageComponent;
    let fixture: ComponentFixture<EditPageComponent>;
    let mockDialog: jasmine.SpyObj<MatDialog>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockDragAndDropService: jasmine.SpyObj<DragAndDropService>;
    let mockMouseService: jasmine.SpyObj<MouseService>;

    beforeEach(async () => {
        mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        mockDragAndDropService = jasmine.createSpyObj(
            'DragAndDropService',
            ['handleDraggedItemPlacement', 'onMouseUp', 'onMouseMove', 'getDraggingState'],
            {
                _currentDraggedItem: null,
            },
        );
        Object.defineProperty(mockDragAndDropService, '_currentDraggedItem', {
            value: null,
            writable: true,
        });
        mockMouseService = jasmine.createSpyObj('MouseService', [], { isMouseDown: false });
        Object.defineProperty(mockMouseService, 'isMouseDown', {
            value: false,
            writable: true,
        });

        await TestBed.configureTestingModule({
            imports: [EditPageComponent],
            providers: [
                provideTippyConfig({
                    defaultVariation: 'tooltip',
                    variations: {
                        tooltip: tooltipVariation,
                        popper: popperVariation,
                    },
                }),
                provideTippyLoader(async () => import('tippy.js')),
                { provide: MatDialog, useValue: mockDialog },
                { provide: Router, useValue: mockRouter },
                { provide: DragAndDropService, useValue: mockDragAndDropService },
                { provide: MouseService, useValue: mockMouseService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditPageComponent);
        component = fixture.componentInstance;

        mockDragAndDropService.getDraggingState.and.returnValue({
            isDragging: true,
            dragX: 100,
            dragY: 200,
        });

        component.title = 'Test Map';
        component.description = 'Test Description';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set isMouseDown to true on mousedown', () => {
        const mockEvent = { button: 0 } as MouseEvent;
        component.onMouseDown(mockEvent);
        expect(mockMouseService.isMouseDown).toBeTrue();
    });

    it('should set isMouseDown to false on mouseup', () => {
        component.onDragEnd();
        expect(mockMouseService.isMouseDown).toBeFalse();
    });

    it('should set isMouseDown to false on dragEnd', () => {
        component.onMouseUp();
        expect(mockMouseService.isMouseDown).toBeFalse();
    });

    it('should call handleDraggedItemPlacement and onMouseUp if an item is dragged on mouseup', () => {
        Object.defineProperty(mockDragAndDropService, 'currentDraggedItem', {
            get: () => ({ name: 'TestItem' }),
        });
        component.onMouseUp();
        expect(mockDragAndDropService.handleDraggedItemPlacement).toHaveBeenCalledWith(-1, -1);
        expect(mockDragAndDropService.onMouseUp).toHaveBeenCalledWith('TestItem');
    });

    it('should call onMouseUp if cursor leaves the window', () => {
        spyOn(component, 'onMouseUp');
        component.onMouseLeave();
        expect(component.onMouseUp).toHaveBeenCalled();
    });

    it('should open the quit confirmation dialog', () => {
        const mockDialogRef = { componentInstance: { confirmed: of(true) }, close: jasmine.createSpy() };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockDialog.open.and.returnValue(mockDialogRef as any);

        component.openQuitDialog();

        expect(mockDialog.open).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should call onMouseMove of dragAndDropService if an item is dragged', () => {
        const mockEvent = { button: 0 } as MouseEvent;
        Object.defineProperty(mockDragAndDropService, 'currentDraggedItem', {
            get: () => ({ name: 'TestItem' }),
        });
        component.onMouseMove(mockEvent);
        expect(mockDragAndDropService.onMouseMove).toHaveBeenCalled();
    });
    it('should update description on input change', () => {
        const mockEvent = { target: { value: 'New Description' } } as unknown as Event;

        component.onDescriptionInput(mockEvent);

        expect(component.description).toBe('New Description');
    });
});
