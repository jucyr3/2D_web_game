import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushTooltipComponent } from './brush-tooltip.component';

describe('BrushTooltipComponent', () => {
  let component: BrushTooltipComponent;
  let fixture: ComponentFixture<BrushTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrushTooltipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrushTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
