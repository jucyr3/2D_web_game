import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetButtonComponent } from './reset-button.component';
import { By } from '@angular/platform-browser';
import { MapService } from '@app/services/edit-services/map.service';

class MockMapService {
    resetMap = jasmine.createSpy('resetMap');
}

describe('ResetButtonComponent', () => {
    let component: ResetButtonComponent;
    let fixture: ComponentFixture<ResetButtonComponent>;
    let mockMapService: MockMapService;

    beforeEach(async () => {
        mockMapService = new MockMapService();

        await TestBed.configureTestingModule({
            imports: [ResetButtonComponent],
            providers: [{ provide: MapService, useValue: mockMapService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ResetButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call reset method when the button is clicked', () => {
        spyOn(component, 'reset');
        const button = fixture.debugElement.query(By.css('button'));

        button.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.reset).toHaveBeenCalled();
    });

    it('should proceed with reset logic if user confirms', () => {
        spyOn(window, 'confirm').and.returnValue(true);

        component.reset();

        expect(window.confirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir réinitialiser ?');
        expect(mockMapService.resetMap).toHaveBeenCalled();
    });

    it('should not proceed with reset logic if user cancels', () => {
        spyOn(window, 'confirm').and.returnValue(false);

        component.reset();

        expect(window.confirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir réinitialiser ?');
        expect(mockMapService.resetMap).not.toHaveBeenCalled();
    });
});
