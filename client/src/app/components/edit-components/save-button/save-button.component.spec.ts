import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveButtonComponent } from './save-button.component';
import { By } from '@angular/platform-browser';

class MockMapService {
    saveMap() {}
}
describe('ResetButtonComponent', () => {
    let component: SaveButtonComponent;
    let fixture: ComponentFixture<SaveButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SaveButtonComponent],
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
});
