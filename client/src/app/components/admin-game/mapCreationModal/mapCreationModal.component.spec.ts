import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MapCreationModalComponent } from './mapCreationModal.component';

describe('ModalComponent', () => {
    let component: MapCreationModalComponent;
    let fixture: ComponentFixture<MapCreationModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormsModule, MapCreationModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MapCreationModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit close event', () => {
        spyOn(component.modalClose, 'emit');
        component.closeModal();
        expect(component.modalClose.emit).toHaveBeenCalled();
    });

    it('should emit create event with form data', () => {
        spyOn(component.create, 'emit');
        component.newMapForm = {
            gameMode: 'Classic',
            size: 10,
        };
        component.createMap();
        expect(component.create.emit).toHaveBeenCalledWith(component.newMapForm);
    });

    it('should update game mode', () => {
        const radio = fixture.debugElement.nativeElement.querySelector('input[value="CTF"]');
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        expect(component.newMapForm.gameMode).toBe('CTF');
    });

    it('should update map size', () => {
        const radio = fixture.debugElement.nativeElement.querySelector('input[value="GRANDE"]');
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        const mapSize = 20;
        expect(component.newMapForm.size).toBe(mapSize);
    });
});
