import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveButtonComponent } from './save-button.component';
import { By } from '@angular/platform-browser';
import { MapService } from '@app/services/map.service'; // Import the actual MapService

/* eslint-disable */

class MockMapService {
    saveMap = jasmine.createSpy('saveMap');
}

describe('SaveButtonComponent', () => {
    // Changed from ResetButtonComponent to SaveButtonComponent
    let component: SaveButtonComponent;
    let fixture: ComponentFixture<SaveButtonComponent>;
    let mockMapService: MockMapService;

    beforeEach(async () => {
        mockMapService = new MockMapService(); // Create instance of MockMapService

        await TestBed.configureTestingModule({
            imports: [SaveButtonComponent],
            providers: [{ provide: MapService, useValue: mockMapService }], // Provide MockMapService for MapService
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call save method when the button is clicked', () => {
        spyOn(component, 'save');
        const button = fixture.debugElement.query(By.css('button'));

        button.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.save).toHaveBeenCalled();
    });

    it('should call saveMap on the MapService when save is called', () => {
        component.save();
        expect(mockMapService.saveMap).toHaveBeenCalled();
    });
});
