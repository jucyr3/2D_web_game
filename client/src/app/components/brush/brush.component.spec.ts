import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushComponent } from './brush.component';

describe('BrushComponent', () => {
  let component: BrushComponent;
  let fixture: ComponentFixture<BrushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrushComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
