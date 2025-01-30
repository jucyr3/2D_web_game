import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetButtonComponent } from './reset-button.component';
import { By } from '@angular/platform-browser';

describe('ResetButtonComponent', () => {
  let component: ResetButtonComponent;
  let fixture: ComponentFixture<ResetButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetButtonComponent],
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
});
