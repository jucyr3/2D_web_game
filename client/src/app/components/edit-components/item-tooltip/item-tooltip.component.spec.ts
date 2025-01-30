import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemTooltipComponent } from './item-tooltip.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ItemObject } from '@common/ItemObject';
import { TIPPY_REF } from '@ngneat/helipopper';

describe('ItemTooltipComponent', () => {
  let component: ItemTooltipComponent;
  let fixture: ComponentFixture<ItemTooltipComponent>;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  beforeEach(async () => {
    sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']);

    await TestBed.configureTestingModule({
      imports: [ ItemTooltipComponent ],
      providers: [
        { provide: DomSanitizer, useValue: sanitizerSpy },
        { provide: TIPPY_REF, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemTooltipComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should capitalize the first letter of item name', () => {
    component.itemObject = { name: 'test item' } as ItemObject;
    expect(component.itemName).toBe('Test item');
  });

  it('should return empty string for itemName when itemObject is null', () => {
    component.itemObject = null;
    expect(component.itemName).toBe('');
  });

  it('should highlight words in item description', () => {
    const testDescription = 'This is a rare item with epic damage and legendary health.';
    component.itemObject = { description: testDescription } as ItemObject;
    
    component.itemDescription;  // Trigger getter
    
    const expectedHighlightedText = 'This is a <span style="color: #007bff; font-weight: bold;">rare</span> item with <span style="color: #6f42c1; font-weight: bold;">epic</span> <span style="color: #dc3545; font-weight: bold;">damage</span> and <span style="color: #ffc107; font-weight: bold;">legendary</span> <span style="color: #28a745; font-weight: bold;">health</span>.';
    
    expect(sanitizerSpy.bypassSecurityTrustHtml).toHaveBeenCalledWith(expectedHighlightedText);
  });

  it('should return empty SafeHtml when itemObject is null', () => {
    component.itemObject = null;
    
    component.itemDescription;  // Trigger getter
    
    expect(sanitizerSpy.bypassSecurityTrustHtml).toHaveBeenCalledWith('');
  });

  it('should capitalize first letter correctly', () => {
    expect(component.capitalizeFirstLetter('hello')).toBe('Hello');
    expect(component.capitalizeFirstLetter('WORLD')).toBe('WORLD');
    expect(component.capitalizeFirstLetter('')).toBe('');
  });

  it('should have tippy reference defined', () => {
    expect(component.tippy).toBeDefined();
  });
});
