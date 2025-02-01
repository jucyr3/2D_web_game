import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewContainerComponent } from './preview-container.component';

describe('PreviewContainerComponent', () => {
  let component: PreviewContainerComponent;
  let fixture: ComponentFixture<PreviewContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
