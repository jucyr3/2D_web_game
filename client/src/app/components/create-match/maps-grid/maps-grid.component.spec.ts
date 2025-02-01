import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsGridComponent } from './maps-grid.component';

describe('MapsGridComponent', () => {
  let component: MapsGridComponent;
  let fixture: ComponentFixture<MapsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
