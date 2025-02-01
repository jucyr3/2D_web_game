import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleStatComponent } from './single-stat.component';
import { By } from '@angular/platform-browser';

describe('SingleStatComponent', () => {
  let component: SingleStatComponent;
  let fixture: ComponentFixture<SingleStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [SingleStatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default input values', () => {
    expect(component.statName).toBe('MonNom');
    expect(component.statValue).toBe(4);
    expect(component.isDiceSix).toBe(false);
    expect(component.showDice).toBe(false);
  });

  it('should display the correct dice image based on isDiceSix', () => {
    component.showDice = true;
    component.isDiceSix = false;
    fixture.detectChanges();
    const diceImage = fixture.debugElement.query(By.css('img')).nativeElement;

    expect(diceImage.src).toContain('d4_dice.png');

    component.isDiceSix = true;
    fixture.detectChanges();
    expect(diceImage.src).toContain('d6_dice.png');
  });

  it('should not display dice image if showDice is false', () => {
    component.showDice = false;
    fixture.detectChanges();
    const diceImage = fixture.debugElement.query(By.css('img'));
    expect(diceImage).toBeNull();
  });
});
