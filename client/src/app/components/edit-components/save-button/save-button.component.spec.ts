import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveButtonComponent } from './save-button.component';
import { By } from '@angular/platform-browser';
import { MapService } from '@app/services/edit-services/map.service';

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
        spyOn(component, 'saveMap');
        const button = fixture.debugElement.query(By.css('button'));

        button.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.saveMap).toHaveBeenCalled();
    });

    it('should call saveMap on the MapService when save is called', () => {
        component.saveMap();
        expect(mockMapService.saveMap).toHaveBeenCalled();
    });
});
