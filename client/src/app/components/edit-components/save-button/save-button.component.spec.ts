import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveButtonComponent } from './save-button.component';
import { By } from '@angular/platform-browser';
import { MapService } from '@app/services/map.service';

class MockMapService {
    saveMap = jasmine.createSpy('saveMap');
}

describe('SaveButtonComponent', () => {
    let component: SaveButtonComponent;
    let fixture: ComponentFixture<SaveButtonComponent>;
    let mockMapService: MockMapService;

    beforeEach(async () => {
        mockMapService = new MockMapService();

        await TestBed.configureTestingModule({
            imports: [SaveButtonComponent],
            providers: [{ provide: MapService, useValue: mockMapService }],
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
