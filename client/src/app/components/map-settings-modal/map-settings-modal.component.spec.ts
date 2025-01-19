import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSettingsModalComponent } from './map-settings-modal.component';

describe('MapSettingsModalComponent', () => {
  let component: MapSettingsModalComponent;
  let fixture: ComponentFixture<MapSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapSettingsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
