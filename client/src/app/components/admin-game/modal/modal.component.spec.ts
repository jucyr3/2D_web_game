import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './modal.component';

fdescribe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event', () => {
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit create event with form data', () => {
    spyOn(component.create, 'emit');
    component.newMapForm = {
      mapName: 'Test Map',
      mapMode: 'Classic',
      mapSize: 'PETITE'
    };
    component.createMap();
    expect(component.create.emit).toHaveBeenCalledWith(component.newMapForm);
  });

  it('should update map name', () => {
    const input = fixture.debugElement.nativeElement.querySelector('input[name="gameName"]');
    input.value = 'New Map';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.newMapForm.mapName).toBe('New Map');
  });

  it('should update game mode', () => {
    const radio = fixture.debugElement.nativeElement.querySelector('input[value="CTF"]');
    radio.checked = true;
    radio.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.newMapForm.mapMode).toBe('CTF');
  });

  it('should update map size', () => {
    const radio = fixture.debugElement.nativeElement.querySelector('input[value="GRANDE"]');
    radio.checked = true;
    radio.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.newMapForm.mapSize).toBe('GRANDE');
  });
});